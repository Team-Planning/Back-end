import { Document } from 'mongoose';

export interface Publicacion extends Document {
  titulo: string;
  descripcion: string;
  precio: number;
  categoria: string; // ObjectId como string
  imagenes: string[]; // Array de ObjectId como string
  vendedorId: string;
  estado: 'borrador' | 'revision' | 'activo' | 'pausado' | 'vendida' | 'rechazada';
  fechaCreacion: Date;
  fechaModificacion?: Date;
  comentarioModerador?: string;
}
