import { Schema } from 'mongoose';

export const ModeracionSchema = new Schema({
  publicacionId: {
    type: Schema.Types.ObjectId,
    ref: 'Publicacion',
    required: true
  },
  moderadorId: {
    type: String,
    required: true
  },
  accion: {
    type: String,
    enum: ['aprobada', 'rechazada'],
    required: true
  },
  comentario: {
    type: String
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});
