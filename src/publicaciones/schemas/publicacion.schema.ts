import { Schema } from 'mongoose';

export const PublicacionSchema = new Schema({
  titulo: {
    type: String,
    required: true,
    maxlength: 80
  },
  descripcion: {
    type: String,
    required: true,
    maxlength: 500
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true
  },
  imagenes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Imagen'
    }
  ],
  vendedorId: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    enum: ['borrador', 'revision', 'activo', 'pausado', 'vendida', 'rechazada'],
    default: 'revision'
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaModificacion: {
    type: Date
  },
  comentarioModerador: {
    type: String
  }
});
