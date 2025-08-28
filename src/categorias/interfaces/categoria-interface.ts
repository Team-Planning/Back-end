import { Document } from 'mongoose';

export interface Categoria extends Document {
  nombre: string;
  descripcion?: string;
}
