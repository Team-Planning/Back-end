# 📡 API Endpoints - Backend GPI

> Documentación completa de los endpoints disponibles para el equipo de Frontend

## 🔗 Información General

**Base URL:** `http://localhost:3000/api`  
**Prefijo Global:** `/api`  
**CORS Habilitado:** `http://localhost:5173` (Frontend Vite)

---

## 📑 Tabla de Contenidos

3. [📝 Publicaciones](#-publicaciones)
4. [📂 Categorías](#-categorías)
5. [📸 Upload de Imágenes (Cloudinary)](#-upload-de-imágenes-cloudinary)
6. [🔑 Autenticación con JWT](#-autenticación-con-jwt)
7. [❌ Códigos de Error](#-códigos-de-error)

---

## 📝 Publicaciones

### 1. Crear Publicación
```http
POST /api/publicaciones
```

**Body:**
```json
{
  "id_vendedor": "507f1f77bcf86cd799439011",
  "id_producto": "PROD-12345",
  "titulo": "iPhone 14 Pro Max 256GB",
  "descripcion": "iPhone en excelente estado, incluye cargador y caja original",
  "categoriaId": "507f1f77bcf86cd799439020",
  "estado": "EN REVISION",
  "multimedia": [
    {
      "url": "https://res.cloudinary.com/demo/image/upload/v1234567890/products/iphone.jpg",
      "orden": 0,
      "tipo": "imagen"
    },
    {
      "url": "https://res.cloudinary.com/demo/image/upload/v1234567890/products/iphone2.jpg",
      "orden": 1,
      "tipo": "imagen"
    }
  ]
}
```

**Validaciones:**
- `id_vendedor`: Requerido, string
- `titulo`: Requerido, 5-100 caracteres
- `descripcion`: Requerido, 10-1000 caracteres
- `categoriaId`: Requerido, MongoDB ObjectId válido
- `multimedia`: Opcional, array de objetos

**Respuesta Exitosa (201):**
```json
{
  "id": "507f1f77bcf86cd799439030",
  "id_vendedor": "507f1f77bcf86cd799439011",
  "id_producto": "PROD-12345",
  "titulo": "iPhone 14 Pro Max 256GB",
  "descripcion": "iPhone en excelente estado...",
  "categoriaId": "507f1f77bcf86cd799439020",
  "estado": "EN REVISION",
  "multimedia": [
    {
      "id": "mm1",
      "url": "https://res.cloudinary.com/demo/...",
      "orden": 0,
      "tipo": "imagen"
    }
  ],
  "createdAt": "2025-10-14T10:30:00.000Z"
}
```

---

### 2. Listar Todas las Publicaciones
```http
GET /api/publicaciones
```

**Respuesta Exitosa (200):**
```json
[
  {
    "id": "507f1f77bcf86cd799439030",
    "titulo": "iPhone 14 Pro Max 256GB",
    "descripcion": "iPhone en excelente estado...",
    "estado": "PUBLICADO",
    "categoriaId": "507f1f77bcf86cd799439020",
    "multimedia": [...],
    "createdAt": "2025-10-14T10:30:00.000Z"
  },
  {
    "id": "507f1f77bcf86cd799439031",
    "titulo": "Samsung Galaxy S23",
    "descripcion": "Teléfono nuevo en caja...",
    "estado": "EN REVISION",
    "categoriaId": "507f1f77bcf86cd799439020",
    "multimedia": [...],
    "createdAt": "2025-10-13T15:20:00.000Z"
  }
]
```

---

### 3. Obtener Publicación por ID
```http
GET /api/publicaciones/:id
```

**Ejemplo:**
```
GET /api/publicaciones/507f1f77bcf86cd799439030
```

**Respuesta Exitosa (200):**
```json
{
  "id": "507f1f77bcf86cd799439030",
  "id_vendedor": "507f1f77bcf86cd799439011",
  "titulo": "iPhone 14 Pro Max 256GB",
  "descripcion": "iPhone en excelente estado...",
  "categoriaId": "507f1f77bcf86cd799439020",
  "estado": "PUBLICADO",
  "multimedia": [
    {
      "id": "mm1",
      "url": "https://res.cloudinary.com/...",
      "orden": 0,
      "tipo": "imagen",
      "cloudinaryPublicId": "pulgashop/productos/abc123"
    }
  ],
  "moderacion": [],
  "createdAt": "2025-10-14T10:30:00.000Z",
  "updatedAt": "2025-10-14T10:30:00.000Z"
}
```

**Errores:**
- `404 Not Found`: Publicación no encontrada

---

### 4. Actualizar Publicación
```http
PUT /api/publicaciones/:id
```

**Body (todos los campos opcionales):**
```json
{
  "titulo": "iPhone 14 Pro Max 256GB - Actualizado",
  "descripcion": "Nueva descripción con más detalles",
  "estado": "PUBLICADO"
}
```

**Respuesta Exitosa (200):**
```json
{
  "id": "507f1f77bcf86cd799439030",
  "titulo": "iPhone 14 Pro Max 256GB - Actualizado",
  "descripcion": "Nueva descripción con más detalles",
  "estado": "PUBLICADO",
  "updatedAt": "2025-10-14T11:00:00.000Z"
}
```

---

### 5. Eliminar Publicación
```http
DELETE /api/publicaciones/:id
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Publicación eliminada exitosamente"
}
```

---

### 6. Cambiar Estado de Publicación
```http
PATCH /api/publicaciones/:id/estado
```

**Body:**
```json
{
  "estado": "PUBLICADO"
}
```

**Estados Disponibles:**
- `EN REVISION`
- `PUBLICADO`
- `RECHAZADO`
- `PAUSADO`
- `VENDIDO`

**Respuesta Exitosa (200):**
```json
{
  "id": "507f1f77bcf86cd799439030",
  "estado": "PUBLICADO",
  "updatedAt": "2025-10-14T11:00:00.000Z"
}
```

---

### 7. Agregar Multimedia a Publicación
```http
POST /api/publicaciones/:id/multimedia
```

**Body:**
```json
{
  "url": "https://res.cloudinary.com/demo/image/upload/v1234567890/products/nueva.jpg",
  "orden": 2,
  "tipo": "imagen"
}
```

**Respuesta Exitosa (201):**
```json
{
  "id": "mm3",
  "url": "https://res.cloudinary.com/demo/...",
  "orden": 2,
  "tipo": "imagen",
  "cloudinaryPublicId": "pulgashop/productos/xyz789"
}
```

---

### 8. Eliminar Multimedia
```http
DELETE /api/publicaciones/multimedia/:multimediaId
```

**Ejemplo:**
```
DELETE /api/publicaciones/multimedia/mm3
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Multimedia eliminada exitosamente"
}
```

---

### 9. Agregar Moderación
```http
POST /api/publicaciones/:id/moderacion
```

**Body:**
```json
{
  "id_moderador": "507f1f77bcf86cd799439015",
  "accion": "APROBAR",
  "comentario": "Publicación aprobada correctamente"
}
```

**Respuesta Exitosa (201):**
```json
{
  "id": "mod1",
  "id_moderador": "507f1f77bcf86cd799439015",
  "accion": "APROBAR",
  "comentario": "Publicación aprobada correctamente",
  "fecha": "2025-10-14T11:00:00.000Z"
}
```

---

## 📂 Categorías

### 1. Crear Categoría
```http
POST /api/categorias
```

**Body:**
```json
{
  "nombre": "Electrónica",
  "descripcion": "Dispositivos electrónicos y accesorios",
  "icono": "electronics",
  "activa": true
}
```

**Validaciones:**
- `nombre`: Requerido, máximo 50 caracteres
- `descripcion`: Opcional, máximo 200 caracteres
- `icono`: Opcional, string
- `activa`: Opcional, booleano (default: true)

**Respuesta Exitosa (201):**
```json
{
  "id": "507f1f77bcf86cd799439020",
  "nombre": "Electrónica",
  "descripcion": "Dispositivos electrónicos y accesorios",
  "icono": "electronics",
  "activa": true,
  "createdAt": "2025-10-14T10:00:00.000Z"
}
```

---

### 2. Listar Todas las Categorías
```http
GET /api/categorias
```

**Respuesta Exitosa (200):**
```json
[
  {
    "id": "507f1f77bcf86cd799439020",
    "nombre": "Electrónica",
    "descripcion": "Dispositivos electrónicos y accesorios",
    "icono": "electronics",
    "activa": true
  },
  {
    "id": "507f1f77bcf86cd799439021",
    "nombre": "Ropa",
    "descripcion": "Ropa y accesorios de moda",
    "icono": "clothing",
    "activa": true
  }
]
```

---

### 3. Listar Categorías Activas
```http
GET /api/categorias/activas
```

**Respuesta Exitosa (200):**
```json
[
  {
    "id": "507f1f77bcf86cd799439020",
    "nombre": "Electrónica",
    "activa": true
  },
  {
    "id": "507f1f77bcf86cd799439021",
    "nombre": "Ropa",
    "activa": true
  }
]
```

---

### 4. Obtener Categoría por ID
```http
GET /api/categorias/:id
```

**Ejemplo:**
```
GET /api/categorias/507f1f77bcf86cd799439020
```

**Respuesta Exitosa (200):**
```json
{
  "id": "507f1f77bcf86cd799439020",
  "nombre": "Electrónica",
  "descripcion": "Dispositivos electrónicos y accesorios",
  "icono": "electronics",
  "activa": true,
  "createdAt": "2025-10-14T10:00:00.000Z"
}
```

---

### 5. Actualizar Categoría
```http
PUT /api/categorias/:id
```

**Body (parcial):**
```json
{
  "nombre": "Electrónica y Tecnología",
  "descripcion": "Nueva descripción actualizada"
}
```

**Respuesta Exitosa (200):**
```json
{
  "id": "507f1f77bcf86cd799439020",
  "nombre": "Electrónica y Tecnología",
  "descripcion": "Nueva descripción actualizada",
  "activa": true
}
```

---

### 6. Eliminar Categoría
```http
DELETE /api/categorias/:id
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Categoría eliminada exitosamente"
}
```

---

### 7. Activar Categoría
```http
PATCH /api/categorias/:id/activar
```

**Respuesta Exitosa (200):**
```json
{
  "id": "507f1f77bcf86cd799439020",
  "nombre": "Electrónica",
  "activa": true
}
```

---

### 8. Desactivar Categoría
```http
PATCH /api/categorias/:id/desactivar
```

**Respuesta Exitosa (200):**
```json
{
  "id": "507f1f77bcf86cd799439020",
  "nombre": "Electrónica",
  "activa": false
}
```

---

## 📸 Upload de Imágenes (Cloudinary)

### 1. Subir Una Imagen
```http
POST /api/upload/image
```

**Content-Type:** `multipart/form-data`

**Form Data:**
```
file: [archivo de imagen]
```

**Validaciones:**
- Tipo: Solo imágenes (image/*)
- Tamaño máximo: 5MB
- Formatos soportados: JPG, PNG, GIF, WebP, etc.

**Respuesta Exitosa (201):**
```json
{
  "mensaje": "Imagen subida exitosamente",
  "imagen": {
    "url": "https://res.cloudinary.com/tu-cloud/image/upload/v1697281234/pulgashop/productos/abc123.jpg",
    "publicId": "pulgashop/productos/abc123",
    "width": 1920,
    "height": 1080,
    "format": "jpg",
    "bytes": 245678
  }
}
```

**Errores:**
- `400 Bad Request`: 
  - "No se ha proporcionado ningún archivo"
  - "El archivo debe ser una imagen"
  - "El archivo no debe superar los 5MB"

**Ejemplo de uso (JavaScript):**
```javascript
const formData = new FormData();
formData.append('file', imageFile);

const response = await fetch('http://localhost:3000/api/upload/image', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(data.imagen.url); // URL de Cloudinary
console.log(data.imagen.publicId); // Para eliminar después
```

---

### 2. Subir Múltiples Imágenes
```http
POST /api/upload/images
```

**Content-Type:** `multipart/form-data`

**Form Data:**
```
files: [archivo1]
files: [archivo2]
files: [archivo3]
...
```

**Límites:**
- Máximo 10 imágenes por petición
- Cada imagen: máximo 5MB
- Solo archivos de tipo imagen

**Respuesta Exitosa (201):**
```json
{
  "mensaje": "3 imágenes subidas exitosamente",
  "imagenes": [
    {
      "url": "https://res.cloudinary.com/.../imagen1.jpg",
      "publicId": "pulgashop/productos/abc123",
      "width": 1920,
      "height": 1080,
      "format": "jpg",
      "bytes": 245678
    },
    {
      "url": "https://res.cloudinary.com/.../imagen2.jpg",
      "publicId": "pulgashop/productos/def456",
      "width": 1280,
      "height": 720,
      "format": "jpg",
      "bytes": 189234
    },
    {
      "url": "https://res.cloudinary.com/.../imagen3.jpg",
      "publicId": "pulgashop/productos/ghi789",
      "width": 800,
      "height": 600,
      "format": "png",
      "bytes": 156789
    }
  ]
}
```

**Errores:**
- `400 Bad Request`:
  - "No se han proporcionado archivos"
  - "El archivo {nombre} debe ser una imagen"
  - "El archivo {nombre} no debe superar los 5MB"

**Ejemplo de uso (JavaScript):**
```javascript
const formData = new FormData();
selectedFiles.forEach(file => {
  formData.append('files', file);
});

const response = await fetch('http://localhost:3000/api/upload/images', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(`${data.imagenes.length} imágenes subidas`);
```

---

### 3. Eliminar Imagen
```http
DELETE /api/upload/:publicId
```

**Parámetro:**
- `publicId`: ID público de Cloudinary (puede contener `/`)

**Ejemplos:**
```
DELETE /api/upload/pulgashop/productos/abc123
DELETE /api/upload/pulgashop%2Fproductos%2Fabc123  (URL encoded)
```

**Respuesta Exitosa (200):**
```json
{
  "mensaje": "Imagen eliminada exitosamente",
  "publicId": "pulgashop/productos/abc123"
}
```

**Errores:**
- `400 Bad Request`: "No se pudo eliminar la imagen"

**Ejemplo de uso (JavaScript):**
```javascript
// El publicId viene de la respuesta al subir
const publicId = "pulgashop/productos/abc123";
const encodedPublicId = encodeURIComponent(publicId);

const response = await fetch(`http://localhost:3000/api/upload/${encodedPublicId}`, {
  method: 'DELETE'
});

const data = await response.json();
console.log(data.mensaje);
```

---

## 🔑 Autenticación con JWT

Los endpoints marcados con 🔒 requieren un token JWT en el header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Cómo Obtener el Token:

1. **Hacer login:**
   ```javascript
   const response = await fetch('http://localhost:3000/api/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       email: 'usuario@example.com',
       password: 'password123'
     })
   });
   
   const { access_token } = await response.json();
   localStorage.setItem('token', access_token);
   ```

2. **Usar el token en peticiones:**
   ```javascript
   const token = localStorage.getItem('token');
   
   const response = await fetch('http://localhost:3000/api/users', {
     headers: {
       'Authorization': `Bearer ${token}`
     }
   });
   ```

### Manejo de Tokens Expirados:

```javascript
// Interceptor para Axios (ejemplo)
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expirado, redirigir a login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## ❌ Códigos de Error

### Códigos HTTP Comunes:

| Código | Significado | Ejemplo |
|--------|-------------|---------|
| `200` | OK | Operación exitosa (GET, PUT, DELETE) |
| `201` | Created | Recurso creado exitosamente (POST) |
| `400` | Bad Request | Datos inválidos o faltantes |
| `401` | Unauthorized | Token inválido o faltante |
| `403` | Forbidden | Sin permisos para esta acción |
| `404` | Not Found | Recurso no encontrado |
| `409` | Conflict | Conflicto (ej: email duplicado) |
| `500` | Internal Server Error | Error del servidor |

### Formato de Errores:

```json
{
  "statusCode": 400,
  "message": "El email ya está registrado",
  "error": "Bad Request"
}
```

O para validaciones múltiples:

```json
{
  "statusCode": 400,
  "message": [
    "El título debe tener al menos 5 caracteres",
    "La descripción es requerida",
    "El categoriaId debe ser un ObjectId válido"
  ],
  "error": "Bad Request"
}
```

---

## 📋 Ejemplos de Integración (Frontend)

### Ejemplo 1: Login y Guardar Token

```typescript
// services/auth.service.ts
export const login = async (email: string, password: string) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};
```

---

### Ejemplo 2: Subir Imágenes con Preview

```typescript
// components/ImageUploader.tsx
import { uploadMultipleImages } from '../services/upload.service';

const handleFileUpload = async (files: FileList) => {
  try {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    const response = await uploadMultipleImages(formData);
    console.log('Imágenes subidas:', response.imagenes);
    
    // Guardar URLs para usar en la publicación
    const imageUrls = response.imagenes.map(img => ({
      url: img.url,
      publicId: img.publicId,
      orden: 0
    }));
    
    setImages(imageUrls);
  } catch (error) {
    console.error('Error subiendo imágenes:', error);
  }
};
```

---

### Ejemplo 3: Crear Publicación Completa

```typescript
// services/publicaciones.service.ts
export const crearPublicacion = async (data: CreatePublicacionDto) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:3000/api/publicaciones', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
};

// Uso:
const publicacion = await crearPublicacion({
  id_vendedor: user.id,
  titulo: 'iPhone 14 Pro',
  descripcion: 'En excelente estado...',
  categoriaId: selectedCategory.id,
  multimedia: uploadedImages // Del ejemplo anterior
});
```

---

### Ejemplo 4: Listar Categorías para Select

```typescript
// hooks/useCategorias.ts
import { useEffect, useState } from 'react';

export const useCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/categorias/activas');
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error('Error cargando categorías:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  return { categorias, loading };
};

// Uso en componente:
const { categorias, loading } = useCategorias();

<Select>
  {categorias.map(cat => (
    <MenuItem key={cat.id} value={cat.id}>
      {cat.nombre}
    </MenuItem>
  ))}
</Select>
```

---

## 📞 Soporte

**Desarrollado por:** Team GPI  
**Última actualización:** 14 de Octubre, 2025  
**Versión Backend:** NestJS 10.3.0  
**Base de Datos:** MongoDB Atlas (Prisma ORM)  

---

## 🔄 Changelog

### v1.0.0 (14-10-2025)
- ✅ Endpoints de autenticación (login, register, me)
- ✅ CRUD completo de usuarios
- ✅ CRUD completo de publicaciones
- ✅ CRUD completo de categorías
- ✅ Upload de imágenes con Cloudinary
- ✅ Gestión de multimedia en publicaciones
- ✅ Sistema de moderación
- ✅ Autenticación JWT
- ✅ Validación de DTOs con class-validator

---

**¡Happy Coding! 🚀**
