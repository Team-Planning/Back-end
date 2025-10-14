# 📸 Guía de Integración con Cloudinary

## 🎯 Introducción

Este backend está configurado para usar **Cloudinary** como servicio de almacenamiento y optimización de imágenes para las publicaciones del marketplace.

## 📋 Características Implementadas

### ✅ Funcionalidades Principales

- **Upload de una sola imagen** - Subida de imágenes individuales
- **Upload múltiple** - Subida de hasta 10 imágenes simultáneamente
- **Eliminación de imágenes** - Borrado de imágenes por publicId
- **Validación de archivos** - Tipo y tamaño (máx. 5MB)
- **Optimización automática** - Compresión y formato automático
- **Thumbnails** - Generación de múltiples tamaños
- **Transformaciones** - URLs optimizadas con transformaciones

## 🔧 Configuración

### 1. Obtener Credenciales de Cloudinary

1. Crea una cuenta en [Cloudinary](https://cloudinary.com/)
2. Ve a tu Dashboard
3. Copia tus credenciales:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 2. Configurar Variables de Entorno

Edita el archivo `.env` en la raíz del proyecto:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=tu_cloud_name_aqui
CLOUDINARY_API_KEY=tu_api_key_aqui
CLOUDINARY_API_SECRET=tu_api_secret_aqui
CLOUDINARY_FOLDER=pulgashop/publicaciones
```

### 3. Verificar Instalación

Paquetes instalados automáticamente:
- `cloudinary` - SDK oficial de Cloudinary
- `multer` - Middleware para multipart/form-data
- `streamifier` - Conversión de buffers a streams
- `@types/multer` y `@types/streamifier` - Type definitions

## 🚀 Uso de la API

### 📤 Subir una Imagen

**Endpoint:** `POST /api/upload/image`

**Headers:**
```
Content-Type: multipart/form-data
```

**Body (form-data):**
```
file: [archivo de imagen]
```

**Ejemplo con cURL:**
```bash
curl -X POST http://localhost:3000/api/upload/image \
  -F "file=@/ruta/a/tu/imagen.jpg"
```

**Respuesta exitosa:**
```json
{
  "mensaje": "Imagen subida exitosamente",
  "imagen": {
    "url": "https://res.cloudinary.com/tu-cloud/image/upload/v1234567890/pulgashop/publicaciones/abc123.jpg",
    "publicId": "pulgashop/publicaciones/abc123",
    "width": 1920,
    "height": 1080,
    "format": "jpg",
    "bytes": 245678
  }
}
```

### 📤 Subir Múltiples Imágenes

**Endpoint:** `POST /api/upload/images`

**Headers:**
```
Content-Type: multipart/form-data
```

**Body (form-data):**
```
files: [archivo1.jpg]
files: [archivo2.jpg]
files: [archivo3.jpg]
```

**Ejemplo con cURL:**
```bash
curl -X POST http://localhost:3000/api/upload/images \
  -F "files=@imagen1.jpg" \
  -F "files=@imagen2.jpg" \
  -F "files=@imagen3.jpg"
```

**Respuesta exitosa:**
```json
{
  "mensaje": "3 imágenes subidas exitosamente",
  "imagenes": [
    {
      "url": "https://res.cloudinary.com/.../img1.jpg",
      "publicId": "pulgashop/publicaciones/img1",
      "width": 1920,
      "height": 1080,
      "format": "jpg",
      "bytes": 245678
    },
    // ... más imágenes
  ]
}
```

### 🗑️ Eliminar una Imagen

**Endpoint:** `DELETE /api/upload/:publicId`

**Nota:** El `publicId` debe incluir la carpeta completa (ej: `pulgashop/publicaciones/abc123`)

**Ejemplo con cURL:**
```bash
curl -X DELETE "http://localhost:3000/api/upload/pulgashop%2Fpublicaciones%2Fabc123"
```

**Respuesta exitosa:**
```json
{
  "mensaje": "Imagen eliminada exitosamente",
  "publicId": "pulgashop/publicaciones/abc123"
}
```

## 💻 Uso desde el Frontend (React)

### Ejemplo: Subir Imagen desde React

```typescript
import axios from 'axios';

// Función para subir una sola imagen
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(
      'http://localhost:3000/api/upload/image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.imagen;
  } catch (error) {
    console.error('Error al subir imagen:', error);
    throw error;
  }
};

// Función para subir múltiples imágenes
export const uploadMultipleImages = async (files: File[]) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  try {
    const response = await axios.post(
      'http://localhost:3000/api/upload/images',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.imagenes;
  } catch (error) {
    console.error('Error al subir imágenes:', error);
    throw error;
  }
};

// Función para eliminar imagen
export const deleteImage = async (publicId: string) => {
  const encodedPublicId = encodeURIComponent(publicId);
  
  try {
    const response = await axios.delete(
      `http://localhost:3000/api/upload/${encodedPublicId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    throw error;
  }
};
```

### Ejemplo: Componente de Upload

```typescript
import React, { useState } from 'react';
import { uploadImage } from '../services/upload.service';

const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      const result = await uploadImage(selectedFile);
      setUploadedImage(result);
      console.log('Imagen subida:', result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile || loading}>
        {loading ? 'Subiendo...' : 'Subir Imagen'}
      </button>
      
      {uploadedImage && (
        <div>
          <h3>Imagen Subida:</h3>
          <img src={uploadedImage.url} alt="Uploaded" style={{ maxWidth: '300px' }} />
          <p>Public ID: {uploadedImage.publicId}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
```

## 🔨 Uso Programático del CloudinaryService

### Inyectar el Servicio

```typescript
import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class PublicacionesService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async crearPublicacion(dto: CreatePublicacionDto, imagenes: Express.Multer.File[]) {
    // Subir imágenes a Cloudinary
    const imagenesSubidas = await this.cloudinaryService.uploadMultipleImages(imagenes);
    
    // Guardar en base de datos con las URLs de Cloudinary
    // ...
  }
}
```

### Métodos Disponibles

```typescript
// Subir una imagen
await cloudinaryService.uploadImage(file, 'carpeta/opcional');

// Subir múltiples imágenes
await cloudinaryService.uploadMultipleImages(files, 'carpeta/opcional');

// Eliminar una imagen
await cloudinaryService.deleteImage('publicId');

// Eliminar múltiples imágenes
await cloudinaryService.deleteMultipleImages(['publicId1', 'publicId2']);

// Obtener información de una imagen
await cloudinaryService.getImageInfo('publicId');

// Generar URL optimizada
const url = cloudinaryService.getOptimizedUrl('publicId', {
  width: 400,
  height: 300,
  crop: 'fill',
  quality: 'auto:good'
});

// Generar thumbnails (small, medium, large, original)
const thumbnails = cloudinaryService.getThumbnailUrls('publicId');
```

## 🎨 Transformaciones de Imágenes

Cloudinary permite transformar imágenes on-the-fly usando la URL:

### Ejemplos de URLs con Transformaciones

```typescript
// Imagen redimensionada a 400x300
https://res.cloudinary.com/tu-cloud/image/upload/w_400,h_300,c_fill/v1234/publicId.jpg

// Imagen con calidad optimizada
https://res.cloudinary.com/tu-cloud/image/upload/q_auto:good/v1234/publicId.jpg

// Imagen en formato WebP automático
https://res.cloudinary.com/tu-cloud/image/upload/f_auto/v1234/publicId.jpg

// Combinación de transformaciones
https://res.cloudinary.com/tu-cloud/image/upload/w_400,h_300,c_fill,q_auto:good,f_auto/v1234/publicId.jpg
```

## 📊 Límites y Validaciones

### Límites Configurados

- **Tamaño máximo por imagen:** 5MB
- **Número máximo de imágenes (upload múltiple):** 10
- **Tipos permitidos:** image/* (jpg, png, gif, webp, etc.)

### Modificar Límites

Edita los archivos:
- **Tamaño:** `src/cloudinary/cloudinary.controller.ts` (línea ~35)
- **Cantidad:** `src/cloudinary/cloudinary.controller.ts` (línea ~57)

## 🔒 Seguridad

### Recomendaciones

1. **Nunca expongas tus credenciales** - Usa variables de entorno
2. **Valida siempre el tipo de archivo** - Ya implementado
3. **Limita el tamaño de archivos** - Ya implementado
4. **Usa HTTPS** - Cloudinary usa HTTPS por defecto
5. **Considera implementar autenticación** - Para endpoints de upload

## 📝 Integración con Publicaciones

### Ejemplo: Crear Publicación con Imágenes

```typescript
// En publicaciones.controller.ts
@Post()
@UseInterceptors(FilesInterceptor('imagenes', 10))
async crear(
  @Body() dto: CreatePublicacionDto,
  @UploadedFiles() imagenes: Express.Multer.File[]
) {
  return this.publicacionesService.crearConImagenes(dto, imagenes);
}

// En publicaciones.service.ts
async crearConImagenes(dto: CreatePublicacionDto, imagenes: Express.Multer.File[]) {
  // 1. Subir imágenes a Cloudinary
  const imagenesSubidas = await this.cloudinaryService.uploadMultipleImages(imagenes);
  
  // 2. Crear publicación en DB
  const publicacion = await this.prisma.publicacion.create({
    data: {
      titulo: dto.titulo,
      // ... otros campos
    },
  });
  
  // 3. Crear registros de multimedia
  for (const img of imagenesSubidas) {
    await this.prisma.multimedia.create({
      data: {
        publicacionId: publicacion.id,
        tipo: 'IMAGEN',
        url: img.url,
        cloudinaryPublicId: img.publicId,
      },
    });
  }
  
  return publicacion;
}
```

## 🧪 Testing

### Probar con Postman

1. Crea una nueva request POST
2. URL: `http://localhost:3000/api/upload/image`
3. Body → form-data
4. Key: `file`, Type: File
5. Selecciona una imagen
6. Send

### Probar con REST Client (VSCode)

```http
### Subir imagen
POST http://localhost:3000/api/upload/image
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="test.jpg"
Content-Type: image/jpeg

< ./test-images/test.jpg
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

## 🐛 Troubleshooting

### Error: "Cannot find module 'cloudinary'"
```bash
pnpm install
```

### Error: "Invalid credentials"
- Verifica que las credenciales en `.env` sean correctas
- Asegúrate de que no haya espacios extra en las variables

### Error: "File too large"
- El archivo supera los 5MB
- Comprime la imagen o aumenta el límite

### Imágenes no se ven
- Verifica que la URL sea accesible
- Revisa que el `publicId` sea correcto
- Comprueba la configuración de Cloudinary

## 📚 Recursos Adicionales

- [Documentación oficial de Cloudinary](https://cloudinary.com/documentation)
- [SDK de Node.js](https://cloudinary.com/documentation/node_integration)
- [Transformaciones de imágenes](https://cloudinary.com/documentation/image_transformations)
- [Optimización automática](https://cloudinary.com/documentation/image_optimization)

## ✅ Checklist de Implementación

- [x] Instalar dependencias (cloudinary, multer, streamifier)
- [x] Crear CloudinaryModule
- [x] Crear CloudinaryService con métodos CRUD
- [x] Crear CloudinaryController con endpoints
- [x] Configurar variables de entorno
- [x] Importar CloudinaryModule en AppModule
- [ ] Configurar credenciales reales en .env
- [ ] Probar upload de imagen
- [ ] Integrar con módulo de Publicaciones
- [ ] Actualizar frontend para usar los endpoints

---

**Última actualización:** 14 de Octubre, 2025
**Versión:** 1.0.0
