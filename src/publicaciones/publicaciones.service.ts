import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ModeracionService } from '../moderacion/moderacion.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';

@Injectable()
export class PublicacionesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly moderacionService: ModeracionService,
  ) {}

  async crear(dto: CreatePublicacionDto) {
    // Crear la publicación con multimedia si existe
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

    // Retornar la publicación actualizada
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
    await this.obtenerPorId(id);

    const publicacion = await this.prisma.publicacion.update({
      where: { id },
      data: {
        id_vendedor: dto.id_vendedor,
        id_producto: dto.id_producto,
        titulo: dto.titulo,
        descripcion: dto.descripcion,
        despacho: dto.despacho,
        precio_envio: dto.precio_envio,
        estado: dto.estado,
      },
      include: {
        multimedia: {
          orderBy: { orden: 'asc' },
        },
      },
    });

    return publicacion;
  }

  async eliminar(id: string) {
    // Verificar que la publicación existe
    const publicacion = await this.obtenerPorId(id);

    // Verificar que no esté ya eliminada
    if (publicacion.estado === 'eliminado') {
      throw new BadRequestException('La publicación ya está eliminada');
    }

    // Actualizar el estado a 'eliminado'
    await this.prisma.publicacion.update({
      where: { id },
      data: { estado: 'eliminado' }
    });

    return { mensaje: 'Publicación eliminada exitosamente' };
  }

  async eliminarForzado(id: string) {
    // Verificar que la publicación existe
    const publicacion = await this.obtenerPorId(id);

    // Eliminar publicación forzadamente
    await this.prisma.publicacion.delete({
      where: { id }
    });

    return { mensaje: 'Publicación eliminada completamente' };
  }

  async cambiarEstado(id: string, estado: string) {
    // Verificar que la publicación existe
    await this.obtenerPorId(id);

    const publicacion = await this.prisma.publicacion.update({
      where: { id },
      data: { estado },
      include: {
        multimedia: {
          orderBy: { orden: 'asc' },
        },
      },
    });

    return publicacion;
  }

  // Métodos adicionales para gestión de multimedia
  async agregarMultimedia(publicacionId: string, multimedia: { url: string; orden: number; tipo?: string }) {
    await this.obtenerPorId(publicacionId);

    return this.prisma.multimedia.create({
      data: {
        id_publicacion: publicacionId,
        url: multimedia.url,
        orden: multimedia.orden,
        tipo: multimedia.tipo || 'imagen',
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

  // Método para obtener historial de moderación
  async obtenerHistorialModeracion(publicacionId: string) {
    await this.obtenerPorId(publicacionId);
    return this.moderacionService.obtenerHistorialModeracion(publicacionId);
  }
}
