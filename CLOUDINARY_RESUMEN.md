# 🎉 Cloudinary - Integración Completa

## ✅ Resumen de lo Implementado

Tu backend NestJS ahora está **100% preparado** para trabajar con Cloudinary como repositorio de imágenes. Aquí está todo lo que se ha configurado:

### 📦 Paquetes Instalados

```json
{
  "dependencies": {
    "cloudinary": "2.7.0",      // SDK oficial de Cloudinary
    "multer": "2.0.2",           // Manejo de archivos multipart
    "streamifier": "0.1.1"       // Conversión de buffers a streams
  },
  "devDependencies": {
    "@types/multer": "2.0.0",
    "@types/streamifier": "0.1.2"
  }
}
```

### 🗂️ Estructura de Archivos Creada

```
GPI_BackTemplate/
├── .env                              ← Variables de Cloudinary añadidas
├── CLOUDINARY_README.md              ← Documentación completa
├── CLOUDINARY_SETUP.md               ← Guía de configuración
├── prisma/
│   └── schema.prisma                 ← Campo cloudinaryPublicId añadido
├── src/
│   ├── config/
│   │   └── cloudinary.config.ts      ← Configuración de Cloudinary
│   ├── cloudinary/
│   │   ├── cloudinary.module.ts      ← Módulo de Cloudinary
│   │   ├── cloudinary.provider.ts    ← Provider para inicializar SDK
│   │   ├── cloudinary.service.ts     ← Servicio con métodos CRUD
│   │   ├── cloudinary.controller.ts  ← Endpoints de upload/delete
│   │   └── ejemplos-integracion.ts.example  ← Ejemplos de uso
│   └── app.module.ts                 ← CloudinaryModule importado
```

### 🔧 Módulo Cloudinary

#### CloudinaryService - Métodos Disponibles

```typescript
// Subir una imagen
uploadImage(file: Express.Multer.File, customFolder?: string)

// Subir múltiples imágenes
uploadMultipleImages(files: Express.Multer.File[], customFolder?: string)

// Eliminar una imagen
deleteImage(publicId: string)

// Eliminar múltiples imágenes
deleteMultipleImages(publicIds: string[])

// Obtener información de una imagen
getImageInfo(publicId: string)

// Generar URL optimizada
getOptimizedUrl(publicId: string, options?: {...})

// Generar thumbnails (small, medium, large, original)
getThumbnailUrls(publicId: string)
```

### 🌐 Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/upload/image` | Subir una sola imagen |
| POST | `/api/upload/images` | Subir hasta 10 imágenes |
| DELETE | `/api/upload/:publicId` | Eliminar una imagen |

### 🗄️ Base de Datos Actualizada

El modelo `Multimedia` ahora incluye:

```prisma
model Multimedia {
  id                  String      @id @default(auto()) @map("_id") @db.ObjectId
  publicacion         Publicacion @relation(fields: [id_publicacion], references: [id])
  id_publicacion      String      @db.ObjectId
  url                 String      // URL de Cloudinary
  cloudinaryPublicId  String?     // ✨ NUEVO - Para eliminar imágenes
  orden               Int
  tipo                String
}
```

### 📝 Validaciones Implementadas

- ✅ **Tipo de archivo:** Solo imágenes (image/*)
- ✅ **Tamaño máximo:** 5MB por imagen
- ✅ **Cantidad máxima:** 10 imágenes por request
- ✅ **Optimización automática:** Calidad auto:good
- ✅ **Formato automático:** WebP/JPEG según navegador

### ⚙️ Variables de Entorno (.env)

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=tu_cloud_name_aqui
CLOUDINARY_API_KEY=tu_api_key_aqui
CLOUDINARY_API_SECRET=tu_api_secret_aqui
CLOUDINARY_FOLDER=pulgashop/publicaciones
```

---

## 🚀 Próximos Pasos - LO QUE DEBES HACER

### 1️⃣ Configurar Credenciales (OBLIGATORIO)

1. Crea una cuenta en [Cloudinary](https://cloudinary.com/) (gratis)
2. Copia tus credenciales del Dashboard
3. Actualiza el archivo `.env` con tus credenciales reales
4. Reinicia el servidor: `pnpm start:dev`

**Ver:** `CLOUDINARY_SETUP.md` para instrucciones detalladas

### 2️⃣ Probar los Endpoints

#### Con Postman:
```
POST http://localhost:3000/api/upload/image
Body: form-data
Key: file (tipo File)
Value: [selecciona una imagen]
```

#### Con cURL:
```bash
curl -X POST http://localhost:3000/api/upload/image \
  -F "file=@ruta/a/tu/imagen.jpg"
```

### 3️⃣ Integrar con Frontend

Crea `src/services/upload.service.ts` en el frontend:

```typescript
import api from './api';

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  
  return response.data.imagen;
};
```

### 4️⃣ Actualizar CreatePublicacion

Modifica el componente para subir imágenes a Cloudinary antes de crear la publicación:

```typescript
// 1. Subir imágenes
const imagenesSubidas = await uploadMultipleImages(selectedImages);

// 2. Crear publicación con URLs de Cloudinary
const publicacion = await publicacionesService.create({
  ...formData,
  multimedia: imagenesSubidas.map((img, i) => ({
    url: img.url,
    cloudinaryPublicId: img.publicId,
    orden: i + 1,
    tipo: 'imagen'
  }))
});
```

---

## 📚 Documentación

### Archivos de Ayuda Creados

1. **CLOUDINARY_README.md**
   - Documentación completa de la API
   - Ejemplos de uso
   - Transformaciones de imágenes
   - Troubleshooting
   - Mejores prácticas

2. **CLOUDINARY_SETUP.md**
   - Guía paso a paso de configuración
   - Instrucciones para obtener credenciales
   - Tests de verificación
   - Integración con frontend

3. **src/cloudinary/ejemplos-integracion.ts.example**
   - Ejemplos de código real
   - Integración con módulo de Publicaciones
   - Uso desde controllers
   - Ejemplos de frontend

---

## 🎯 Características Principales

### ✨ Funcionalidades Listas para Usar

1. **Upload Simple**
   - Sube una imagen y obtén URL instantáneamente
   - Validación automática de tipo y tamaño

2. **Upload Múltiple**
   - Hasta 10 imágenes simultáneamente
   - Procesamiento paralelo para velocidad

3. **Eliminación Inteligente**
   - Elimina imágenes de Cloudinary con un request
   - Limpieza automática de recursos

4. **Optimización Automática**
   - Compresión automática (quality: auto:good)
   - Formato adaptativo (WebP, JPEG, PNG)
   - Carga rápida en cualquier dispositivo

5. **Thumbnails Dinámicos**
   - Genera múltiples tamaños sobre la marcha
   - Sin almacenamiento extra
   - URLs personalizables

### 🔐 Seguridad

- ✅ Validación de tipo de archivo
- ✅ Límite de tamaño (5MB)
- ✅ Credenciales en variables de entorno
- ✅ HTTPS por defecto (Cloudinary)
- ✅ Public IDs únicos

---

## 📊 Flujo de Trabajo Recomendado

### Para Crear una Publicación con Imágenes:

```
1. Usuario selecciona imágenes en el frontend
   ↓
2. Frontend envía imágenes a POST /api/upload/images
   ↓
3. Cloudinary almacena y devuelve URLs + publicIds
   ↓
4. Frontend envía datos de publicación + URLs a POST /api/publicaciones
   ↓
5. Backend guarda publicación con referencias a imágenes
   ↓
6. Las imágenes se sirven desde Cloudinary (rápido y optimizado)
```

### Para Eliminar una Publicación con Imágenes:

```
1. Frontend solicita DELETE /api/publicaciones/:id
   ↓
2. Backend obtiene todos los cloudinaryPublicIds de multimedia
   ↓
3. Backend elimina imágenes de Cloudinary
   ↓
4. Backend elimina publicación de MongoDB (cascade elimina multimedia)
   ↓
5. Todo limpio - sin archivos huérfanos
```

---

## 🧪 Verificación Rápida

### ¿Todo Funciona? Checklist

- [ ] Credenciales configuradas en `.env`
- [ ] Servidor arranca sin errores
- [ ] Endpoints mapeados en consola:
  ```
  [RouterExplorer] Mapped {/api/upload/image, POST} route
  [RouterExplorer] Mapped {/api/upload/images, POST} route
  [RouterExplorer] Mapped {/api/upload/:publicId, DELETE} route
  ```
- [ ] Test con Postman exitoso
- [ ] Imagen visible en Cloudinary Dashboard

### Comandos Útiles

```bash
# Reiniciar servidor
pnpm start:dev

# Ver logs de Prisma
pnpm prisma:studio

# Regenerar cliente Prisma
pnpm prisma:generate

# Verificar instalación de paquetes
pnpm list cloudinary multer streamifier
```

---

## 💡 Tips y Mejores Prácticas

### Para Desarrollo

1. **Usa el plan gratuito de Cloudinary** (25 créditos mensuales)
2. **Crea carpetas separadas** para diferentes tipos de contenido
3. **Guarda siempre el publicId** para poder eliminar después
4. **Usa thumbnails** en listados para mejor rendimiento

### Para Producción

1. **Implementa autenticación** en endpoints de upload
2. **Considera límites de rate** para evitar abuso
3. **Monitorea el uso** de créditos en Cloudinary
4. **Implementa lazy loading** en el frontend
5. **Usa CDN de Cloudinary** para geo-distribución

---

## 🐛 Troubleshooting Común

| Problema | Solución |
|----------|----------|
| "Invalid credentials" | Verifica `.env` y reinicia servidor |
| "Cannot find module 'cloudinary'" | Ejecuta `pnpm install` |
| "File too large" | Reduce tamaño o aumenta límite en controller |
| Imagen no se ve | Verifica URL en navegador directamente |
| Error al eliminar | Asegúrate que publicId esté URL-encoded |

---

## 📞 Recursos de Ayuda

- **Documentación Cloudinary:** https://cloudinary.com/documentation
- **Node.js SDK:** https://cloudinary.com/documentation/node_integration
- **Transformaciones:** https://cloudinary.com/documentation/image_transformations
- **Optimización:** https://cloudinary.com/documentation/image_optimization

---

## ✅ Checklist Final

- [x] Paquetes instalados
- [x] Módulo Cloudinary creado
- [x] Endpoints de upload/delete implementados
- [x] Schema de Prisma actualizado
- [x] Variables de entorno configuradas (placeholders)
- [x] Documentación completa creada
- [x] Ejemplos de integración provistos
- [x] Cambios commiteados y pusheados
- [ ] **Credenciales reales configuradas** ← TU TAREA
- [ ] **Probado con Postman** ← TU TAREA
- [ ] **Integrado con frontend** ← TU TAREA

---

## 🎊 ¡Felicidades!

Tu backend está **completamente preparado** para manejar imágenes con Cloudinary. Solo necesitas:

1. Configurar tus credenciales (5 minutos)
2. Probar los endpoints (2 minutos)
3. ¡Empezar a subir imágenes! 🚀

**Lee `CLOUDINARY_SETUP.md` para comenzar ahora.**

---

**Última actualización:** 14 de Octubre, 2025  
**Versión:** 1.0.0  
**Estado:** ✅ Listo para usar (pendiente configuración de credenciales)
