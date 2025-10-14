import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';

@Injectable()
export class PublicacionesService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(dto: CreatePublicacionDto) {
    // Verificar que la categoría existe
    const categoria = await this.prisma.categoria.findUnique({
      where: { id: dto.categoriaId },
    });

    if (!categoria) {
      throw new BadRequestException('La categoría especificada no existe');
    }

    // Crear la publicación con multimedia si existe
    const publicacion = await this.prisma.publicacion.create({
      data: {
        id_vendedor: dto.id_vendedor,
        id_producto: dto.id_producto,
        titulo: dto.titulo,
        descripcion: dto.descripcion,
        categoriaId: dto.categoriaId,
        estado: dto.estado || 'en revision',
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
        categoria: true,
        multimedia: {
          orderBy: { orden: 'asc' },
        },
      },
    });

    return publicacion;
  }

  async listarTodas() {
    return this.prisma.publicacion.findMany({
      where: {
        estado: { not: 'eliminada' },
      },
      include: {
        categoria: true,
        multimedia: {
          orderBy: { orden: 'asc' },
        },
      },
      orderBy: {
        fechaCreacion: 'desc',
      },
    });
  }

  async obtenerPorId(id: string) {
    const publicacion = await this.prisma.publicacion.findUnique({
      where: { id },
      include: {
        categoria: true,
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

    // Si se actualiza la categoría, verificar que existe
    if (dto.categoriaId) {
      const categoria = await this.prisma.categoria.findUnique({
        where: { id: dto.categoriaId },
      });

      if (!categoria) {
        throw new BadRequestException('La categoría especificada no existe');
      }
    }

    const publicacion = await this.prisma.publicacion.update({
      where: { id },
      data: {
        id_vendedor: dto.id_vendedor,
        id_producto: dto.id_producto,
        titulo: dto.titulo,
        descripcion: dto.descripcion,
        categoriaId: dto.categoriaId,
        estado: dto.estado,
      },
      include: {
        categoria: true,
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
    if (publicacion.estado === 'eliminada') {
      throw new BadRequestException('La publicación ya está eliminada');
    }

    // Actualizar el estado a 'eliminada'
    await this.prisma.publicacion.update({
      where: { id },
      data: { estado: 'eliminada' }
    });

    return { mensaje: 'Publicación eliminada exitosamente' };
  }

  async cambiarEstado(id: string, estado: string) {
    // Verificar que la publicación existe
    await this.obtenerPorId(id);

    const publicacion = await this.prisma.publicacion.update({
      where: { id },
      data: { estado },
      include: {
        categoria: true,
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

  // Método para agregar moderación
  async agregarModeracion(
    publicacionId: string,
    moderacion: { id_moderador?: string; accion: string; comentario: string },
  ) {
    await this.obtenerPorId(publicacionId);

    return this.prisma.moderacion.create({
      data: {
        id_publicacion: publicacionId,
        id_moderador: moderacion.id_moderador,
        accion: moderacion.accion,
        comentario: moderacion.comentario,
      },
    });
  }
}
