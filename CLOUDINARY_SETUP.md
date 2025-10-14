# 🚀 Pasos Finales para Activar Cloudinary

## ✅ Lo que ya está hecho

- [x] Instaladas todas las dependencias necesarias (cloudinary, multer, streamifier)
- [x] Creado CloudinaryModule con provider y service
- [x] Creado CloudinaryController con endpoints de upload
- [x] Configuradas las variables de entorno en `.env`
- [x] Actualizado el schema de Prisma con campo `cloudinaryPublicId`
- [x] Integrado CloudinaryModule en AppModule
- [x] Creada documentación completa en `CLOUDINARY_README.md`
- [x] Creados ejemplos de integración

## 🔑 Pasos que DEBES hacer

### 1. Obtener Credenciales de Cloudinary

1. Ve a [https://cloudinary.com/](https://cloudinary.com/)
2. Crea una cuenta gratuita (si no tienes una)
3. Una vez dentro, ve al **Dashboard**
4. Copia los siguientes datos:
   - **Cloud Name** (ejemplo: `dpn8xyzab`)
   - **API Key** (ejemplo: `123456789012345`)
   - **API Secret** (ejemplo: `abcdefghijklmnopqrstuvwxyz123`)

### 2. Actualizar el archivo .env

Abre el archivo `.env` en la raíz del proyecto y reemplaza los valores:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=tu_cloud_name_real_aqui
CLOUDINARY_API_KEY=tu_api_key_real_aqui
CLOUDINARY_API_SECRET=tu_api_secret_real_aqui
CLOUDINARY_FOLDER=pulgashop/publicaciones
```

**IMPORTANTE:** Reemplaza `tu_cloud_name_real_aqui`, `tu_api_key_real_aqui` y `tu_api_secret_real_aqui` con tus credenciales reales.

### 3. Reiniciar el servidor

Una vez configuradas las credenciales:

```bash
# Detener el servidor actual (Ctrl + C)

# Iniciar nuevamente
pnpm start:dev
```

### 4. Probar los endpoints

#### Opción A: Con Postman

1. Abre Postman
2. Crea una nueva request:
   - Método: `POST`
   - URL: `http://localhost:3000/api/upload/image`
   - Body → form-data
   - Key: `file` (tipo: File)
   - Value: Selecciona una imagen de tu computadora
3. Click en **Send**

#### Opción B: Con cURL

```bash
curl -X POST http://localhost:3000/api/upload/image \
  -F "file=@C:/ruta/a/tu/imagen.jpg"
```

### 5. Verificar en Cloudinary

1. Ve a tu Dashboard de Cloudinary
2. Click en **Media Library** en el menú izquierdo
3. Deberías ver tu imagen en la carpeta `pulgashop/publicaciones`

## 📝 Endpoints Disponibles

### 1. Subir una imagen
```
POST /api/upload/image
Content-Type: multipart/form-data
Body: file (imagen)
```

### 2. Subir múltiples imágenes
```
POST /api/upload/images
Content-Type: multipart/form-data
Body: files[] (hasta 10 imágenes)
```

### 3. Eliminar una imagen
```
DELETE /api/upload/:publicId
Ejemplo: DELETE /api/upload/pulgashop%2Fpublicaciones%2Fabc123
```

## 🔗 Integración con Frontend

### Crear servicio de upload en React

Crea el archivo `src/services/upload.service.ts`:

```typescript
import api from './api';

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export const uploadImage = async (file: File): Promise<CloudinaryUploadResult> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.imagen;
};

export const uploadMultipleImages = async (files: File[]): Promise<CloudinaryUploadResult[]> => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  const response = await api.post('/upload/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.imagenes;
};

export const deleteImage = async (publicId: string): Promise<void> => {
  const encodedPublicId = encodeURIComponent(publicId);
  await api.delete(`/upload/${encodedPublicId}`);
};
```

### Modificar CreatePublicacion para usar Cloudinary

En `src/views/publicaciones/CreatePublicacion.tsx`, actualiza la función de submit:

```typescript
import { uploadMultipleImages } from '../../services/upload.service';

const handleSubmit = async () => {
  try {
    setLoading(true);

    // 1. Subir imágenes a Cloudinary
    const imagenesSubidas = await uploadMultipleImages(selectedImages);

    // 2. Crear publicación con las URLs de Cloudinary
    const publicacionData = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      precio: formData.precio,
      categoriaId: formData.categoriaId,
      ubicacion: formData.ubicacion,
      multimedia: imagenesSubidas.map((img, index) => ({
        url: img.url,
        cloudinaryPublicId: img.publicId,
        orden: index + 1,
        tipo: 'imagen',
      })),
    };

    await publicacionesService.create(publicacionData);
    
    alert('Publicación creada exitosamente!');
    navigate('/publicaciones');
  } catch (error) {
    console.error('Error:', error);
    alert('Error al crear publicación');
  } finally {
    setLoading(false);
  }
};
```

## 🧪 Testing Rápido

### Test 1: Verificar que el módulo carga

```bash
# El servidor debería arrancar sin errores
pnpm start:dev

# Deberías ver en la consola:
# [RouterExplorer] Mapped {/api/upload/image, POST} route
# [RouterExplorer] Mapped {/api/upload/images, POST} route
# [RouterExplorer] Mapped {/api/upload/:publicId, DELETE} route
```

### Test 2: Upload de prueba

```bash
# Descarga una imagen de prueba o usa una que tengas
# Súbela usando cURL:

curl -X POST http://localhost:3000/api/upload/image \
  -F "file=@test.jpg"

# Deberías recibir:
{
  "mensaje": "Imagen subida exitosamente",
  "imagen": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "pulgashop/publicaciones/...",
    "width": 1920,
    "height": 1080,
    "format": "jpg",
    "bytes": 245678
  }
}
```

## 📚 Documentación Completa

Lee `CLOUDINARY_README.md` para:
- Documentación detallada de la API
- Ejemplos de transformaciones de imágenes
- Guía de integración completa
- Troubleshooting
- Mejores prácticas

## ⚠️ Troubleshooting

### Error: "Invalid credentials"
- Verifica que las credenciales en `.env` sean correctas
- Asegúrate de no tener espacios extra
- Reinicia el servidor después de cambiar `.env`

### Error: "Cannot find module 'cloudinary'"
```bash
pnpm install
```

### Las imágenes no se suben
- Verifica tu conexión a internet
- Comprueba que la imagen sea menor a 5MB
- Revisa que sea un archivo de imagen válido

### El servidor no arranca
```bash
# Reinstalar dependencias
rm -rf node_modules
pnpm install

# Regenerar cliente de Prisma
pnpm prisma:generate
```

## 🎉 ¡Listo!

Una vez completados estos pasos, tendrás:
- ✅ Cloudinary completamente configurado
- ✅ Endpoints de upload funcionando
- ✅ Imágenes optimizadas automáticamente
- ✅ Sistema listo para integrar con publicaciones

---

**Siguiente paso:** Integra Cloudinary con el módulo de Publicaciones usando los ejemplos en `src/cloudinary/ejemplos-integracion.ts`
