import { Document } from 'mongoose';

export interface Publicacion extends Document {
  id_vendedor: string;
  id_producto: string;
  titulo: string;
  descripcion: string;
  despacho: 'retiro_en_tienda' | 'envio' | 'ambos';
  precio_envio?: number;
  multimedia: string[];
  estado: 'borrador' | 'en revision' | 'rechazada' | 'activa' | 'pausada' | 'eliminada';
  fechaCreacion: Date;
  fechaModificacion?: Date;
  comentarioModerador?: string;
}