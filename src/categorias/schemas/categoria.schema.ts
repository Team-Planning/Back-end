import { Schema } from 'mongoose';

export const CategoriaSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    unique: true
  },
  descripcion: {
    type: String
  }
});
