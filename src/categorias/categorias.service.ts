import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(dto: CreateCategoriaDto) {
    // Verificar que no exista una categoría con el mismo nombre
    const categoriaExistente = await this.prisma.categoria.findUnique({
      where: { nombre: dto.nombre },
    });

    if (categoriaExistente) {
      throw new ConflictException('Ya existe una categoría con ese nombre');
    }

    return this.prisma.categoria.create({
      data: dto,
    });
  }

  async listarTodas() {
    return this.prisma.categoria.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  async listarActivas() {
    return this.prisma.categoria.findMany({
      where: { activa: true },
      orderBy: { nombre: 'asc' },
    });
  }

  async obtenerPorId(id: string) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
      include: {
        publicaciones: {
          take: 10,
          orderBy: { fechaCreacion: 'desc' },
        },
      },
    });

    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return categoria;
  }

  async actualizar(id: string, dto: UpdateCategoriaDto) {
    await this.obtenerPorId(id);

    // Si se actualiza el nombre, verificar que no exista otra categoría con ese nombre
    if (dto.nombre) {
      const categoriaExistente = await this.prisma.categoria.findFirst({
        where: {
          nombre: dto.nombre,
          NOT: { id },
        },
      });

      if (categoriaExistente) {
        throw new ConflictException('Ya existe una categoría con ese nombre');
      }
    }

    return this.prisma.categoria.update({
      where: { id },
      data: dto,
    });
  }

  async eliminar(id: string) {
    const categoria = await this.obtenerPorId(id);

    // Verificar si tiene publicaciones asociadas
    const cantidadPublicaciones = await this.prisma.publicacion.count({
      where: { categoriaId: id },
    });

    if (cantidadPublicaciones > 0) {
      throw new ConflictException(
        `No se puede eliminar la categoría porque tiene ${cantidadPublicaciones} publicaciones asociadas`,
      );
    }

    await this.prisma.categoria.delete({
      where: { id },
    });

    return { mensaje: 'Categoría eliminada exitosamente' };
  }

  async activarDesactivar(id: string, activa: boolean) {
    await this.obtenerPorId(id);

    return this.prisma.categoria.update({
      where: { id },
      data: { activa },
    });
  }
}
