import { Document } from 'mongoose';

export interface Imagen extends Document {
  url: string;
  publicacionId: string; // ObjectId como string
  orden: number;
}
