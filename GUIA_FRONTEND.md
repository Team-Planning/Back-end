# 🚀 Guía Rápida para el Equipo Frontend

## ✅ Estado del Backend

El backend está **completamente configurado y listo para usar**. Incluye:

- ✅ Prisma ORM configurado con MongoDB Atlas
- ✅ 4 colecciones creadas en la base de datos
- ✅ 10 categorías iniciales pobladas
- ✅ Endpoints REST completos y funcionales
- ✅ Validaciones implementadas
- ✅ Relaciones entre modelos configuradas

## 🔗 URL Base

```
http://localhost:3000/api
```

**IMPORTANTE**: Todos los endpoints tienen el prefijo `/api`

## 📋 Colecciones en la Base de Datos

1. **categorias** - Categorías de productos
2. **publicaciones** - Publicaciones de productos/servicios
3. **multimedia** - Imágenes y videos de las publicaciones
4. **moderaciones** - Registro de aprobaciones/rechazos

## 🎯 Endpoints Principales

### Categorías
- `GET /api/categorias` - Listar todas
- `GET /api/categorias/activas` - Solo activas
- `GET /api/categorias/:id` - Ver una específica
- `POST /api/categorias` - Crear
- `PUT /api/categorias/:id` - Actualizar
- `DELETE /api/categorias/:id` - Eliminar

### Publicaciones (CORE - Su responsabilidad)
- `GET /api/publicaciones` - Listar todas
- `GET /api/publicaciones/:id` - Ver una específica
- `POST /api/publicaciones` - **Crear publicación** ⭐
- `PUT /api/publicaciones/:id` - Actualizar
- `DELETE /api/publicaciones/:id` - **Eliminar publicación** ⭐
- `PATCH /api/publicaciones/:id/estado` - Cambiar estado

### Multimedia
- `POST /api/publicaciones/:id/multimedia` - Agregar imagen/video
- `DELETE /api/publicaciones/multimedia/:id` - Eliminar imagen/video

### Moderación
- `POST /api/publicaciones/:id/moderacion` - Registrar aprobación/rechazo

## 📦 Estructura de Datos

### Crear Publicación (POST /publicaciones)

```json
{
  "id_vendedor": "string",           // REQUERIDO - ID del vendedor
  "id_producto": "string",           // OPCIONAL - ID del producto
  "titulo": "string",                // REQUERIDO - Min: 5, Max: 100 caracteres
  "descripcion": "string",           // REQUERIDO - Min: 10, Max: 1000 caracteres
  "categoriaId": "ObjectId",         // REQUERIDO - ID de la categoría (24 caracteres hex)
  "estado": "string",                // OPCIONAL - Default: "EN REVISION"
  "multimedia": [                    // OPCIONAL - Array de imágenes/videos
    {
      "url": "string",
      "orden": 0,
      "tipo": "imagen"               // "imagen" o "video"
    }
  ]
}
```

### Respuesta de Publicación

```json
{
  "id": "67018e8b5c4f6a001e789012",
  "id_vendedor": "vendedor_12345",
  "id_producto": "prod_67890",
  "titulo": "iPhone 15 Pro Max",
  "descripcion": "Descripción del producto...",
  "estado": "EN REVISION",
  "fechaCreacion": "2025-10-14T10:30:00.000Z",
  "fechaModificacion": "2025-10-14T10:30:00.000Z",
  "categoriaId": "67018e8b5c4f6a001e123456",
  "categoria": {
    "id": "67018e8b5c4f6a001e123456",
    "nombre": "Electrónica",
    "descripcion": "Dispositivos electrónicos...",
    "icono": "electronics",
    "activa": true
  },
  "multimedia": [
    {
      "id": "67018e8b5c4f6a001e999999",
      "url": "https://ejemplo.com/imagen.jpg",
      "orden": 0,
      "tipo": "imagen"
    }
  ],
  "moderaciones": []
}
```

## 🎨 Estados de Publicación

| Estado | Descripción |
|--------|-------------|
| `EN REVISION` | Estado por defecto al crear |
| `BORRADOR` | Guardado pero no publicado |
| `ACTIVO` | Visible para todos |
| `PAUSADO` | Temporalmente oculto |
| `VENDIDO` | Producto ya vendido |
| `RECHAZADO` | No cumple políticas |

## 🔧 Cómo Usar

### 1. Levantar el Backend

```bash
cd GPI_BackTemplate
pnpm install
pnpm start:dev
```

### 2. Probar Endpoints

Opción A - **REST Client** (Recomendado):
- Instalar extensión "REST Client" en VS Code
- Abrir archivo `api-examples.http`
- Hacer clic en "Send Request" sobre cualquier petición

Opción B - **Postman/Thunder Client**:
- Importar las peticiones del archivo `api-examples.http`

Opción C - **Desde tu código Frontend**:

```javascript
// Ejemplo con fetch
const crearPublicacion = async () => {
  const response = await fetch('http://localhost:3000/api/publicaciones', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id_vendedor: 'vendedor_123',
      titulo: 'Mi producto',
      descripcion: 'Descripción del producto...',
      categoriaId: '67018e8b5c4f6a001e123456', // ID real de categoría
      multimedia: [
        {
          url: 'https://ejemplo.com/imagen.jpg',
          orden: 0,
          tipo: 'imagen'
        }
      ]
    })
  });
  
  const publicacion = await response.json();
  return publicacion;
};
```

## 📝 Categorías Disponibles

El sistema incluye estas categorías por defecto:

1. Electrónica
2. Moda
3. Hogar y Muebles
4. Deportes
5. Juguetes
6. Libros
7. Automóviles
8. Servicios
9. Herramientas
10. Otros

Para obtener los IDs reales, hacer:
```
GET http://localhost:3000/api/categorias
```

## ⚠️ Validaciones Importantes

- **Título**: 5-100 caracteres
- **Descripción**: 10-1000 caracteres
- **CategoriaId**: Debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)
- **ID Vendedor**: Requerido
- **Multimedia**: Opcional, puede enviarse vacío

## 🐛 Manejo de Errores

El backend devuelve errores en formato estándar:

```json
{
  "statusCode": 400,
  "message": "La categoría especificada no existe",
  "error": "Bad Request"
}
```

Códigos de estado HTTP:
- `200` - Éxito
- `201` - Creado exitosamente
- `400` - Error de validación
- `404` - No encontrado
- `409` - Conflicto (ej: categoría duplicada)

## 🔍 Ver la Base de Datos

Para visualizar los datos en tiempo real:

```bash
pnpm prisma:studio
```

Esto abre una interfaz web en `http://localhost:5555` donde pueden ver y editar los datos.

## 📞 Contacto

Si tienen dudas o encuentran problemas:
- Revisar el archivo `PRISMA_README.md` para documentación completa
- Usar `api-examples.http` para ejemplos de todas las peticiones
- Los logs del backend muestran detalles de cada petición

## 🎯 Responsabilidades del Microservicio

Este microservicio se encarga **EXCLUSIVAMENTE** de:
- ✅ Crear publicaciones
- ✅ Eliminar publicaciones
- ✅ Actualizar publicaciones (opcional)
- ✅ Listar publicaciones
- ✅ Gestionar multimedia de publicaciones

**NO se encarga de:**
- ❌ Autenticación de usuarios (otro microservicio)
- ❌ Gestión de vendedores (otro microservicio)
- ❌ Gestión de productos (otro microservicio)
- ❌ Pagos o transacciones (otro microservicio)

## 🚀 ¡Todo listo!

El backend está completamente funcional y esperando sus peticiones. ¡A codear! 💪
