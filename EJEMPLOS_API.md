# 📡 Ejemplos de Uso - API de Publicaciones

**URL Base:** `http://localhost:3000/api`

---

## 1️⃣ Crear una Publicación

### Endpoint:
```http
POST /api/publicaciones
Content-Type: application/json
```

### Body (JSON):
```json
{
  "id_vendedor": "vendedor_12345",
  "id_producto": "producto_67890",
  "titulo": "iPhone 13 Pro Max 256GB",
  "descripcion": "Vendo iPhone 13 Pro Max de 256GB en excelente estado, con caja original y todos los accesorios. Batería al 95%.",
  "despacho": "ambos",
  "precio_envio": 5000
}
```

### Respuesta (Ejemplo):
```json
{
  "id": "673285f6a1b2c3d4e5f67890",
  "id_vendedor": "vendedor_12345",
  "id_producto": "producto_67890",
  "titulo": "iPhone 13 Pro Max 256GB",
  "descripcion": "Vendo iPhone 13 Pro Max de 256GB en excelente estado, con caja original y todos los accesorios. Batería al 95%.",
  "despacho": "ambos",
  "precio_envio": 5000,
  "estado": "en_revision",
  "fecha_creacion": "2025-11-11T15:30:00.000Z",
  "fecha_modificacion": "2025-11-11T15:30:00.000Z",
  "multimedia": [],
  "moderaciones": [
    {
      "id": "673285f6a1b2c3d4e5f67891",
      "tipo_moderacion": "automatica",
      "accion": "aprobado",
      "motivo": "No se detectaron palabras inapropiadas",
      "palabras_detectadas": [],
      "contenido_detectado": [],
      "fecha": "2025-11-11T15:30:01.000Z"
    }
  ]
}
```

---

## 2️⃣ Crear Publicación con Multimedia

### Body (JSON):
```json
{
  "id_vendedor": "vendedor_12345",
  "id_producto": "producto_67890",
  "titulo": "Notebook Gamer ASUS ROG",
  "descripcion": "Notebook gamer de última generación, RTX 4060, 16GB RAM, SSD 512GB. Perfecto para gaming y trabajo profesional.",
  "despacho": "envio",
  "precio_envio": 10000,
  "multimedia": [
    {
      "url": "https://res.cloudinary.com/demo/image/upload/v1/notebook1.jpg",
      "orden": 0,
      "tipo": "imagen"
    },
    {
      "url": "https://res.cloudinary.com/demo/image/upload/v1/notebook2.jpg",
      "orden": 1,
      "tipo": "imagen"
    }
  ]
}
```

---

## 3️⃣ Listar Todas las Publicaciones

### Endpoint:
```http
GET /api/publicaciones
```

### Respuesta (Ejemplo):
```json
[
  {
    "id": "673285f6a1b2c3d4e5f67890",
    "id_vendedor": "vendedor_12345",
    "id_producto": "producto_67890",
    "titulo": "iPhone 13 Pro Max 256GB",
    "descripcion": "Vendo iPhone 13 Pro Max...",
    "despacho": "ambos",
    "precio_envio": 5000,
    "estado": "activo",
    "fecha_creacion": "2025-11-11T15:30:00.000Z",
    "fecha_modificacion": "2025-11-11T15:30:00.000Z",
    "multimedia": []
  },
  {
    "id": "673285f6a1b2c3d4e5f67891",
    "id_vendedor": "vendedor_54321",
    "id_producto": "producto_11111",
    "titulo": "Bicicleta de montaña Trek",
    "descripcion": "Bicicleta aro 29...",
    "despacho": "retiro_en_tienda",
    "precio_envio": null,
    "estado": "activo",
    "fecha_creacion": "2025-11-10T10:15:00.000Z",
    "fecha_modificacion": "2025-11-10T10:15:00.000Z",
    "multimedia": [...]
  }
]
```

---

## 4️⃣ Obtener Publicación por ID

### Endpoint:
```http
GET /api/publicaciones/673285f6a1b2c3d4e5f67890
```

### Respuesta (Ejemplo):
```json
{
  "id": "673285f6a1b2c3d4e5f67890",
  "id_vendedor": "vendedor_12345",
  "id_producto": "producto_67890",
  "titulo": "iPhone 13 Pro Max 256GB",
  "descripcion": "Vendo iPhone 13 Pro Max de 256GB en excelente estado...",
  "despacho": "ambos",
  "precio_envio": 5000,
  "estado": "activo",
  "fecha_creacion": "2025-11-11T15:30:00.000Z",
  "fecha_modificacion": "2025-11-11T15:30:00.000Z",
  "multimedia": [],
  "moderaciones": [
    {
      "id": "673285f6a1b2c3d4e5f67891",
      "id_publicacion": "673285f6a1b2c3d4e5f67890",
      "id_moderador": null,
      "tipo_moderacion": "automatica",
      "accion": "aprobado",
      "motivo": "No se detectaron palabras inapropiadas",
      "palabras_detectadas": [],
      "contenido_detectado": [],
      "fecha": "2025-11-11T15:30:01.000Z"
    }
  ]
}
```

---

## 5️⃣ Actualizar Publicación

### Endpoint:
```http
PUT /api/publicaciones/673285f6a1b2c3d4e5f67890
Content-Type: application/json
```

### Body (JSON) - Actualizar solo campos necesarios:
```json
{
  "titulo": "iPhone 13 Pro Max 256GB - REBAJADO",
  "despacho": "envio",
  "precio_envio": 3000
}
```

### Respuesta:
```json
{
  "id": "673285f6a1b2c3d4e5f67890",
  "id_vendedor": "vendedor_12345",
  "id_producto": "producto_67890",
  "titulo": "iPhone 13 Pro Max 256GB - REBAJADO",
  "descripcion": "Vendo iPhone 13 Pro Max de 256GB en excelente estado...",
  "despacho": "envio",
  "precio_envio": 3000,
  "estado": "activo",
  "fecha_creacion": "2025-11-11T15:30:00.000Z",
  "fecha_modificacion": "2025-11-11T16:45:00.000Z",
  "multimedia": []
}
```

---

## 6️⃣ Cambiar Estado de Publicación

### Endpoint:
```http
PATCH /api/publicaciones/673285f6a1b2c3d4e5f67890/estado
Content-Type: application/json
```

### Body (JSON):
```json
{
  "estado": "pausado"
}
```

**Estados permitidos:**
- `borrador`
- `en_revision`
- `activo`
- `pausado`
- `vendido`
- `rechazado`
- `eliminado`

---

## 7️⃣ Eliminar Publicación (Soft Delete)

### Endpoint:
```http
DELETE /api/publicaciones/673285f6a1b2c3d4e5f67890
```

### Respuesta:
```json
{
  "mensaje": "Publicación eliminada exitosamente"
}
```

**Nota:** Esto solo cambia el estado a `"eliminado"`, no borra la publicación de la base de datos.

---

## 8️⃣ Eliminar Publicación Permanentemente

### Endpoint:
```http
DELETE /api/publicaciones/eliminar/673285f6a1b2c3d4e5f67890
```

### Respuesta:
```json
{
  "mensaje": "Publicación eliminada completamente"
}
```

**⚠️ Advertencia:** Esta acción es irreversible y elimina la publicación y toda su multimedia asociada.

---

## 9️⃣ Agregar Multimedia a Publicación Existente

### Endpoint:
```http
POST /api/publicaciones/673285f6a1b2c3d4e5f67890/multimedia
Content-Type: application/json
```

### Body (JSON):
```json
{
  "url": "https://res.cloudinary.com/demo/image/upload/v1/nueva-imagen.jpg",
  "orden": 2,
  "tipo": "imagen"
}
```

### Respuesta:
```json
{
  "id": "673285f6a1b2c3d4e5f67892",
  "id_publicacion": "673285f6a1b2c3d4e5f67890",
  "url": "https://res.cloudinary.com/demo/image/upload/v1/nueva-imagen.jpg",
  "cloudinary_public_id": null,
  "orden": 2,
  "tipo": "imagen"
}
```

---

## 🔟 Eliminar Multimedia

### Endpoint:
```http
DELETE /api/publicaciones/multimedia/673285f6a1b2c3d4e5f67892
```

### Respuesta:
```json
{
  "mensaje": "Multimedia eliminada exitosamente"
}
```

---

## 1️⃣1️⃣ Moderación Manual de Publicación

### Endpoint:
```http
POST /api/publicaciones/673285f6a1b2c3d4e5f67890/moderacion
Content-Type: application/json
```

### Body (JSON):
```json
{
  "id_moderador": "admin_001",
  "accion": "rechazado",
  "motivo": "Contiene información de contacto no permitida en la descripción"
}
```

### Respuesta:
```json
{
  "id": "673285f6a1b2c3d4e5f67893",
  "id_publicacion": "673285f6a1b2c3d4e5f67890",
  "id_moderador": "admin_001",
  "tipo_moderacion": "manual",
  "accion": "rechazado",
  "motivo": "Contiene información de contacto no permitida en la descripción",
  "palabras_detectadas": [],
  "contenido_detectado": [],
  "fecha": "2025-11-11T17:00:00.000Z"
}
```

---

## 1️⃣2️⃣ Ver Historial de Moderación

### Endpoint:
```http
GET /api/publicaciones/673285f6a1b2c3d4e5f67890/moderacion
```

### Respuesta:
```json
[
  {
    "id": "673285f6a1b2c3d4e5f67893",
    "id_publicacion": "673285f6a1b2c3d4e5f67890",
    "id_moderador": "admin_001",
    "tipo_moderacion": "manual",
    "accion": "rechazado",
    "motivo": "Contiene información de contacto no permitida",
    "palabras_detectadas": [],
    "contenido_detectado": [],
    "fecha": "2025-11-11T17:00:00.000Z"
  },
  {
    "id": "673285f6a1b2c3d4e5f67891",
    "id_publicacion": "673285f6a1b2c3d4e5f67890",
    "id_moderador": null,
    "tipo_moderacion": "automatica",
    "accion": "aprobado",
    "motivo": "No se detectaron palabras inapropiadas",
    "palabras_detectadas": [],
    "contenido_detectado": [],
    "fecha": "2025-11-11T15:30:01.000Z"
  }
]
```

---

## ⚠️ Ejemplo: Publicación Rechazada Automáticamente

### Request:
```http
POST /api/publicaciones
Content-Type: application/json
```

### Body (JSON) - Contiene palabras inapropiadas:
```json
{
  "id_vendedor": "vendedor_999",
  "id_producto": "producto_999",
  "titulo": "Vendo marihuana de calidad",
  "descripcion": "Producto de excelente calidad, contactar por WhatsApp",
  "despacho": "envio",
  "precio_envio": 0
}
```

### Respuesta:
```json
{
  "id": "673285f6a1b2c3d4e5f67894",
  "id_vendedor": "vendedor_999",
  "id_producto": "producto_999",
  "titulo": "Vendo marihuana de calidad",
  "descripcion": "Producto de excelente calidad, contactar por WhatsApp",
  "despacho": "envio",
  "precio_envio": 0,
  "estado": "rechazado",
  "fecha_creacion": "2025-11-11T18:00:00.000Z",
  "fecha_modificacion": "2025-11-11T18:00:00.000Z",
  "multimedia": [],
  "moderaciones": [
    {
      "id": "673285f6a1b2c3d4e5f67895",
      "id_publicacion": "673285f6a1b2c3d4e5f67894",
      "id_moderador": null,
      "tipo_moderacion": "automatica",
      "accion": "rechazado",
      "motivo": "Se detectaron palabras o contenido inapropiado",
      "palabras_detectadas": ["marihuana"],
      "contenido_detectado": ["drogas"],
      "fecha": "2025-11-11T18:00:01.000Z"
    }
  ]
}
```

---

## 📋 Validaciones de Campos

### Campos Requeridos (CreatePublicacionDto):
- ✅ `id_vendedor` (String, NOT NULL)
- ✅ `id_producto` (String, NOT NULL)
- ✅ `titulo` (String, 5-100 caracteres)
- ✅ `descripcion` (String, 10-1000 caracteres)

### Campos Opcionales:
- ⚪ `despacho` (String: `'retiro_en_tienda'` | `'envio'` | `'ambos'`) - Default: `'retiro_en_tienda'`
- ⚪ `precio_envio` (Float ≥ 0)
- ⚪ `estado` (String) - Default: `'en_revision'`
- ⚪ `multimedia` (Array de objetos)

---

## 🔗 Integración con Microservicio de Productos

### Flujo de Integración:
1. El frontend/usuario crea un **producto** en el microservicio de productos → obtiene `id_producto`
2. Luego crea una **publicación** en este microservicio asociada a ese `id_producto`
3. La publicación maneja:
   - Información de visualización (título, descripción)
   - Opciones de despacho
   - Precio de envío (si aplica)
   - Multimedia (imágenes/videos)
   - Estado de moderación

### Ejemplo Completo:
```
1. POST /productos → Response: { "id": "producto_67890", "nombre": "iPhone 13 Pro Max", "precio": 850000, ... }

2. POST /publicaciones →
   {
     "id_vendedor": "vendedor_12345",
     "id_producto": "producto_67890",  ← Conecta con el producto
     "titulo": "iPhone 13 Pro Max 256GB",
     "descripcion": "...",
     "despacho": "ambos",
     "precio_envio": 5000
   }
```

---

## 📊 Tipos de Despacho

| Valor | Descripción |
|-------|-------------|
| `retiro_en_tienda` | El comprador debe retirar el producto en tienda/punto físico |
| `envio` | El producto se envía a domicilio (requiere `precio_envio`) |
| `ambos` | El comprador puede elegir entre retiro o envío |

---

**Documento generado:** 11/11/2025  
**Servidor:** http://localhost:3000/api
