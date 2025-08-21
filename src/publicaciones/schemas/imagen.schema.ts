import { Schema } from 'mongoose';

export const ImagenSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  publicacionId: {
    type: Schema.Types.ObjectId,
    ref: 'Publicacion',
    required: true
  },
  orden: {
    type: Number,
    required: true
  }
});
