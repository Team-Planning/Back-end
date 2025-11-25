import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ModeracionService } from '../moderacion/moderacion.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { HttpService } from '@nestjs/axios';

const ESTADOS_VALIDOS = [
  'borrador',
  'en_revision',
  'activo',
  'pausado',
  'vendido',
  'rechazado',
  'eliminado',
] as const;

type EstadoPublicacion = (typeof ESTADOS_VALIDOS)[number];

@Injectable()
export class PublicacionesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly moderacionService: ModeracionService,
    private readonly httpService: HttpService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async crear(dto: CreatePublicacionDto) {
    const publicacion = await this.prisma.publicacion.create({
      data: {
        id_vendedor: dto.id_vendedor,
        id_tienda: dto.id_tienda,
        id_producto: dto.id_producto,
        titulo: dto.titulo,
        descripcion: dto.descripcion,
        estado: 'en_revision', // Siempre inicia en revisión
        multimedia: dto.multimedia
          ? {
              create: dto.multimedia.map((m) => ({
                url: m.url,
                orden: m.orden,
                tipo: m.tipo || 'imagen',
                cloudinary_public_id: m.cloudinary_public_id ?? null,
              })),
            }
          : undefined,
      },
      include: {
        multimedia: {
          orderBy: { orden: 'asc' },
        },
      },
    });

    await this.moderacionService.moderarPublicacion(
      publicacion.id,
      publicacion.titulo,
      publicacion.descripcion,
    );

    return this.obtenerPorId(publicacion.id);
  }

  async listarTodas(includeEliminadas: boolean = false) {
    try {
      const whereClause = includeEliminadas 
        ? {} 
        : { estado: { not: 'eliminado' } };

      const publicaciones = await this.prisma.publicacion.findMany({
        where: whereClause,
        include: {
          multimedia: {
            orderBy: { orden: 'asc' },
          },
        },
        orderBy: {
          fecha_creacion: 'desc',
        },
      });

      // Obtener datos del microservicio de productos
      const publicacionesEnriquecidas = await Promise.all(
        publicaciones.map(async (pub) => {
          try {
            const producto = await this.httpService.axiosRef
              .get(`http://localhost:16014/api/productos/${pub.id_producto}`)
              .then(res => res.data)
              .catch(() => null);

            return { ...pub, producto };
          } catch (error) {
            console.log(`Error al obtener producto ${pub.id_producto}:`, error.message);
            return { ...pub, producto: null };
          }
        }),
      );

      return publicacionesEnriquecidas;
    } catch (error) {
      console.error('Error en listarTodas:', error);
      throw error;
    }
  }

  async obtenerPorId(id: string) {
    try {
      const publicacion = await this.prisma.publicacion.findUnique({
        where: { id },
        include: {
          multimedia: {
            orderBy: { orden: 'asc' },
          },
          moderaciones: {
            orderBy: { fecha: 'desc' },
          },
        },
      });

      if (!publicacion) {
        throw new NotFoundException(`Publicación con ID ${id} no encontrada`);
      }

      // Obtener datos del microservicio de productos (con manejo de errores)
      let producto = null;
      try {
        producto = await this.httpService.axiosRef
          .get(`http://localhost:16014/api/productos/${publicacion.id_producto}`, { timeout: 3000 })
          .then((res) => res.data)
          .catch((err) => {
            console.log(`Microservicio de productos no disponible:`, err.message);
            return null;
          });
      } catch (error) {
        console.log('Error al obtener producto:', error.message);
      }

      // Obtener datos del microservicio de reseñas (con manejo de errores)
      let reseñas = [];
      if (producto?.id) {
        try {
          reseñas = await this.httpService.axiosRef
            .get(`http://localhost:3500/ratings/publicacion/${producto.id}`, { timeout: 3000 })
            .then((res) => res.data)
            .catch((err) => {
              console.log(`Microservicio de reseñas no disponible:`, err.message);
              return [];
            });
        } catch (error) {
          console.log('Error al obtener reseñas:', error.message);
        }
      }

      return {
        ...publicacion,
        producto,
        reseñas,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error en obtenerPorId:', error);
      throw error;
    }
  }

  async actualizar(id: string, dto: UpdatePublicacionDto) {
    // Verificar que la publicación existe
    const existente = await this.obtenerPorId(id);

    const data: any = {};

    if (dto.titulo !== undefined) data.titulo = dto.titulo;
    if (dto.descripcion !== undefined) data.descripcion = dto.descripcion;
    if (dto.estado !== undefined) {
      if (!ESTADOS_VALIDOS.includes(dto.estado as EstadoPublicacion)) {
        throw new BadRequestException('Estado inválido');
      }
      // si ya está eliminado, no permitimos cambiarlo vía actualizar
      if (
        existente.estado === 'eliminado' &&
        dto.estado !== 'eliminado'
      ) {
        throw new BadRequestException(
          'No se puede cambiar el estado de una publicación eliminada',
        );
      }
      data.estado = dto.estado;
    }

    const publicacion = await this.prisma.publicacion.update({
      where: { id },
      data,
      include: {
        multimedia: {
          orderBy: { orden: 'asc' },
        },
      },
    });

    return publicacion;
  }

  async eliminar(id: string) {
    const publicacion = await this.obtenerPorId(id);

    if (publicacion.estado === 'eliminado') {
      throw new BadRequestException('La publicación ya está eliminada');
    }

    // Marcar como eliminado y guardar la fecha de eliminación
    await this.prisma.publicacion.update({
      where: { id },
      data: { 
        estado: 'eliminado',
        fecha_eliminacion: new Date() // Guardar fecha para borrado automático después de 1 mes
      },
    });

    return { mensaje: 'Publicación eliminada exitosamente. Se eliminará permanentemente después de 30 días.' };
  }

  async eliminarForzado(id: string) {
    const publicacion = await this.obtenerPorId(id);

    // Obtener todas las imágenes con cloudinary_public_id
    const imagenesConPublicId = publicacion.multimedia
      .filter(m => m.cloudinary_public_id)
      .map(m => m.cloudinary_public_id!);

    // Eliminar imágenes de Cloudinary
    if (imagenesConPublicId.length > 0) {
      try {
        const result = await this.cloudinaryService.deleteMultipleImages(imagenesConPublicId);
        console.log(`Imágenes eliminadas de Cloudinary: ${result.deleted.length}`);
        if (result.errors.length > 0) {
          console.error(`Errores al eliminar imágenes: ${result.errors.join(', ')}`);
        }
      } catch (error) {
        console.error(`Error al eliminar imágenes de Cloudinary: ${error.message}`);
        // Continuamos con la eliminación de la BD aunque falle Cloudinary
      }
    }

    // Eliminar publicación (cascade eliminará multimedia y moderaciones)
    await this.prisma.publicacion.delete({
      where: { id },
    });

    return { 
      mensaje: 'Publicación eliminada completamente',
      imagenes_eliminadas: imagenesConPublicId.length
    };
  }

  async cambiarEstado(id: string, estado: EstadoPublicacion) {
    const publicacion = await this.obtenerPorId(id);

    if (!ESTADOS_VALIDOS.includes(estado)) {
      throw new BadRequestException('Estado inválido');
    }

    if (publicacion.estado === 'eliminado' && estado !== 'eliminado') {
      throw new BadRequestException(
        'No se puede cambiar el estado de una publicación eliminada',
      );
    }

    const actualizada = await this.prisma.publicacion.update({
      where: { id },
      data: { estado },
      include: {
        multimedia: {
          orderBy: { orden: 'asc' },
        },
      },
    });

    return actualizada;
  }

  async agregarMultimedia(
    publicacionId: string,
    multimedia: { url: string; orden: number; tipo?: string; cloudinary_public_id?: string },
  ) {
    await this.obtenerPorId(publicacionId);

    const count = await this.prisma.multimedia.count({
      where: { id_publicacion: publicacionId },
    });

    if (count >= 6) {
      throw new BadRequestException(
        'La publicación ya tiene el máximo de 6 archivos multimedia',
      );
    }

    return this.prisma.multimedia.create({
      data: {
        id_publicacion: publicacionId,
        url: multimedia.url,
        orden: multimedia.orden,
        tipo: multimedia.tipo || 'imagen',
        cloudinary_public_id: multimedia.cloudinary_public_id ?? null,
      },
    });
  }

  async eliminarMultimedia(multimediaId: string) {
    const multimedia = await this.prisma.multimedia.findUnique({
      where: { id: multimediaId },
    });

    if (!multimedia) {
      throw new NotFoundException('Multimedia no encontrada');
    }

    // Eliminar de Cloudinary si existe el public_id
    if (multimedia.cloudinary_public_id) {
      try {
        await this.cloudinaryService.deleteImage(multimedia.cloudinary_public_id);
        console.log(`Imagen eliminada de Cloudinary: ${multimedia.cloudinary_public_id}`);
      } catch (error) {
        console.error(`Error al eliminar imagen de Cloudinary: ${error.message}`);
        // No lanzamos error para que continúe eliminando de la BD
      }
    }

    // Eliminar de la base de datos
    await this.prisma.multimedia.delete({
      where: { id: multimediaId },
    });

    return { 
      mensaje: 'Multimedia eliminada exitosamente', 
      cloudinary_public_id: multimedia.cloudinary_public_id,
      eliminada_de_cloudinary: !!multimedia.cloudinary_public_id
    };
  }

  async obtenerHistorialModeracion(publicacionId: string) {
    await this.obtenerPorId(publicacionId);
    return this.moderacionService.obtenerHistorialModeracion(publicacionId);
  }
}
