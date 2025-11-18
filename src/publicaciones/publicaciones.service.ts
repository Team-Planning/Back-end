import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ModeracionService } from '../moderacion/moderacion.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';

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
  ) {}

  async crear(dto: CreatePublicacionDto) {
    const publicacion = await this.prisma.publicacion.create({
      data: {
        id_vendedor: dto.id_vendedor,
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
                // si tu DTO ya tiene esta propiedad:
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

    // Ejecutar moderación automática
    await this.moderacionService.moderarPublicacion(
      publicacion.id,
      publicacion.titulo,
      publicacion.descripcion,
    );

    // Retornar la publicación actualizada (con moderaciones incluidas)
    return this.obtenerPorId(publicacion.id);
  }

  async listarTodas() {
    return this.prisma.publicacion.findMany({
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

    return publicacion;
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

  // Métodos adicionales para gestión de multimedia
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

    // Delegas en el servicio de moderación, que debería respetar el modelo:
    // tipo_moderacion = 'manual', palabras_detectadas = [], contenido_detectado = []
    return this.moderacionService.moderacionManual(
      publicacionId,
      idModerador,
      accion,
      motivo,
    );
  }

  // Método para obtener historial de moderación
  async obtenerHistorialModeracion(publicacionId: string) {
    await this.obtenerPorId(publicacionId);
    return this.moderacionService.obtenerHistorialModeracion(publicacionId);
  }
}
