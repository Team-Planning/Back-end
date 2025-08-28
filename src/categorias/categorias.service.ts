import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Categoria } from './interfaces/categoria-interface';


@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>
  ) {}

  async crear(dto: CreateCategoriaDto): Promise<Categoria> {
    const nueva = new this.categoriaModel(dto);
    return nueva.save();
  }

  async listarTodas(): Promise<Categoria[]> {
    return this.categoriaModel.find().exec();
  }

  async obtenerPorId(id: string): Promise<Categoria> {
    const cat = await this.categoriaModel.findById(id).exec();
    if (!cat) throw new NotFoundException('Categoría no encontrada');
    return cat;
  }

  async actualizar(id: string, dto: UpdateCategoriaDto): Promise<Categoria> {
    const actualizada = await this.categoriaModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!actualizada) throw new NotFoundException('Categoría no encontrada');
    return actualizada;
  }

  async eliminar(id: string): Promise<void> {
    const res = await this.categoriaModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Categoría no encontrada');
  }
}
