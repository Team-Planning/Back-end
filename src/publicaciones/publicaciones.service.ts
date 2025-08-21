import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { Publicacion } from './interfaces/publicacion.interface';


@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel('Publicacion') private readonly publicacionModel: Model<Publicacion>
  ) {}

  async crear(dto: CreatePublicacionDto): Promise<Publicacion> {
    const nueva = new this.publicacionModel(dto);
    return nueva.save();
  }

  async listarTodas(): Promise<Publicacion[]> {
    return this.publicacionModel.find().populate('categoria').populate('imagenes').exec();
  }

  async obtenerPorId(id: string): Promise<Publicacion> {
    const pub = await this.publicacionModel.findById(id).populate('categoria').populate('imagenes').exec();
    if (!pub) throw new NotFoundException('Publicación no encontrada');
    return pub;
  }

  async actualizar(id: string, dto: UpdatePublicacionDto): Promise<Publicacion> {
    const actualizada = await this.publicacionModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!actualizada) throw new NotFoundException('Publicación no encontrada');
    return actualizada;
  }

  async eliminar(id: string): Promise<void> {
    const res = await this.publicacionModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Publicación no encontrada');
  }

  async cambiarEstado(id: string, estado: string): Promise<Publicacion> {
    const actualizada = await this.publicacionModel.findByIdAndUpdate(id, { estado }, { new: true }).exec();
    if (!actualizada) throw new NotFoundException('Publicación no encontrada');
    return actualizada;
  }
}
