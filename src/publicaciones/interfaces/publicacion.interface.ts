export interface Publicacion {
  id: string;
  id_vendedor: number;
  id_tienda: number;
  id_producto: string;

  titulo: string;
  descripcion: string;

  despacho: 'retiro_en_tienda' | 'envio' | 'ambos';
  precio_envio?: number | null;

  estado:
    | 'borrador'
    | 'en_revision'
    | 'activo'
    | 'pausado'
    | 'vendido'
    | 'rechazado'
    | 'eliminado';

  fecha_creacion: Date;
  fecha_modificacion: Date;

  multimedia: {
    id: string;
    url: string;
    cloudinary_public_id?: string | null;
    orden: number;
    tipo: 'imagen' | 'video';
  }[];

  moderaciones: {
    id: string;
    id_publicacion: string;
    id_moderador?: string | null;

    tipo_moderacion: 'automatica' | 'manual';
    accion: 'aprobado' | 'rechazado';
    motivo: string;

    palabras_detectadas: string[];
    contenido_detectado: string[];
    fecha: Date;
  }[];
}
