import { Document } from 'mongoose';

export interface Publicacion extends Document {
  titulo: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagenes: string[];
  vendedorId: string;
  estado: 'borrador' | 'en revision' | 'rechazada' | 'activa' | 'pausada' | 'eliminada';
  fechaCreacion: Date;
  fechaModificacion?: Date;
  comentarioModerador?: string;
}
