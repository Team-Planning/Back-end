import { Document } from 'mongoose';

export interface Moderacion extends Document {
  publicacionId: string;
  moderadorId: string;
  accion: 'aprobada' | 'rechazada';
  comentario?: string;
  fecha: Date;
}
