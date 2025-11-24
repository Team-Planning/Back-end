import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ModeracionService } from '../moderacion/moderacion.service';
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
  ) {}

  async crear(dto: CreatePublicacionDto) {
    const publicacion = await this.prisma.publicacion.create({
      data: {
        id_vendedor: dto.id_vendedor,
        id_tienda: dto.id_tienda,
        id_producto: dto.id_producto,
        titulo: dto.titulo,
        descripcion: dto.descripcion,
        despacho: dto.despacho || 'retiro_en_tienda',
        precio_envio: dto.precio_envio,
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

  async listarTodas() {
    const publicaciones = await this.prisma.publicacion.findMany({
      where: {
        estado: { not: 'eliminado' },
      },
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
        const producto = await this.httpService.axiosRef
          .get(`http://localhost:16014/api/productos/${pub.id_producto}`)
          .then(res => res.data)
          .catch(() => null);

        return { ...pub, producto };
      }),
    );

    return publicacionesEnriquecidas;
  }

  async obtenerPorTienda(id_tienda: string) {
    const publicaciones = await this.prisma.publicacion.findMany({
      where: { id_tienda },
      include: {
        multimedia: {
          orderBy: { orden: 'asc' },
        },
        moderaciones: {
          orderBy: { fecha: 'desc' },
        },
      },
    });

    if (!publicaciones || publicaciones.length === 0) {
      throw new NotFoundException(`No hay publicaciones para la tienda ${id_tienda}`);
    }

    const resultados = await Promise.all(
    publicaciones.map(async (pub) => {
      const producto = await this.httpService.axiosRef
        .get(`http://localhost:16014/api/productos/${pub.id_producto}`)
        .then((res) => res.data)
        .catch(() => null);

      return { ...pub, producto };
    })
  );

  return resultados;
  }

  async obtenerPorId(id: string) {
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

    // Obtener datos del microservicio de productos
    const producto = await this.httpService.axiosRef
      .get(`http://localhost:16014/api/productos/${publicacion.id_producto}`)
      .then((res) => res.data)
      .catch(() => null);

    // Obtener datos del microservicio de reseñas
    const reseñas = await this.httpService.axiosRef
      .get(`http://localhost:3500/ratings/publicacion/${producto.id}`)
      .then((res) => res.data)
      .catch(() => []);

    return {
      ...publicacion,
      producto,
      reseñas,
    };
  }

  async actualizar(id: string, dto: UpdatePublicacionDto) {
    // Verificar que la publicación existe
    const existente = await this.obtenerPorId(id);

    const data: any = {};

    if (dto.titulo !== undefined) data.titulo = dto.titulo;
    if (dto.descripcion !== undefined) data.descripcion = dto.descripcion;
    if (dto.despacho !== undefined) data.despacho = dto.despacho;
    if (dto.precio_envio !== undefined) data.precio_envio = dto.precio_envio;
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

    await this.prisma.publicacion.update({
      where: { id },
      data: { estado: 'eliminado' },
    });

    return { mensaje: 'Publicación eliminada exitosamente' };
  }

  async eliminarForzado(id: string) {
    await this.obtenerPorId(id);

    await this.prisma.publicacion.delete({
      where: { id },
    });

    return { mensaje: 'Publicación eliminada completamente' };
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

    await this.prisma.multimedia.delete({
      where: { id: multimediaId },
    });

    return { mensaje: 'Multimedia eliminada exitosamente' };
  }

  // Método para agregar moderación manual
  async agregarModeracionManual(
    publicacionId: string,
    idModerador: string,
    accion: 'aprobado' | 'rechazado',
    motivo: string,
  ) {
    await this.obtenerPorId(publicacionId);

    return this.moderacionService.moderacionManual(
      publicacionId,
      idModerador,
      accion,
      motivo,
    );
  }

  async obtenerHistorialModeracion(publicacionId: string) {
    await this.obtenerPorId(publicacionId);
    return this.moderacionService.obtenerHistorialModeracion(publicacionId);
  }
}
