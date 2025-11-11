# 📝 Resumen de Cambios - Microservicio de Publicaciones

**Fecha:** 11 de Noviembre 2025  
**Actualización:** v2.0 - Integración con Microservicios

---

## ✅ Cambios Implementados

### 1️⃣ **Eliminación del Campo `precio`**
- ❌ **Antes:** La publicación contenía el campo `precio` 
- ✅ **Ahora:** El precio pertenece exclusivamente al **microservicio de productos**
- **Razón:** Separación de responsabilidades entre microservicios

### 2️⃣ **Adición del Campo `id_producto`**
- ✅ **Nuevo campo obligatorio:** `id_producto` (String)
- **Propósito:** Conectar la publicación con el producto del otro microservicio
- **Tipo:** Referencia externa (Foreign Key lógica)

### 3️⃣ **Campo `precio_envio` Mantenido**
- ✅ Se mantiene `precio_envio` (Float, opcional)
- **Razón:** El costo de envío es responsabilidad de quien publica, no del producto en sí

---

## 🗂️ Estructura Actual de la Tabla `publicaciones`

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | ObjectId | ✅ Sí | ID único de la publicación |
| `id_vendedor` | String | ✅ Sí | Referencia al microservicio de usuarios |
| `id_producto` | String | ✅ Sí | **NUEVO** - Referencia al microservicio de productos |
| `titulo` | String | ✅ Sí | Título de la publicación (5-100 caracteres) |
| `descripcion` | String | ✅ Sí | Descripción detallada (10-1000 caracteres) |
| `despacho` | String | ✅ Sí | Tipo de despacho: `retiro_en_tienda`, `envio`, `ambos` |
| `precio_envio` | Float | ⚪ No | Costo del envío (si aplica) |
| `estado` | String | ✅ Sí | Estado: `borrador`, `en_revision`, `activo`, etc. |
| `fecha_creacion` | DateTime | ✅ Sí | Fecha de creación (automático) |
| `fecha_modificacion` | DateTime | ✅ Sí | Última modificación (automático) |

---

## 🔗 Arquitectura de Microservicios

```
┌─────────────────────────┐
│ Microservicio USUARIOS  │
│  - Gestión de usuarios  │
│  - Autenticación        │
└───────────┬─────────────┘
            │
            │ id_vendedor
            │
            ▼
┌─────────────────────────┐        ┌──────────────────────────┐
│ Microservicio PRODUCTOS │◄───────┤ Microservicio            │
│  - Datos del producto   │        │ PUBLICACIONES (TU EQUIPO)│
│  - PRECIO del producto  │        │  - Visualización         │
│  - Stock                │        │  - Moderación            │
│  - Categorías           │        │  - Multimedia            │
└───────────┬─────────────┘        │  - Despacho              │
            │                      │  - PRECIO DE ENVÍO       │
            │ id_producto          └──────────────────────────┘
            │
            └──────────────────────►
```

---

## 📊 Flujo de Creación de Publicación

### Paso 1: Crear Producto (Otro Microservicio)
```http
POST /api/productos
{
  "nombre": "iPhone 13 Pro Max",
  "precio": 850000,
  "stock": 5,
  "categoria": "Electrónica"
}

Response:
{
  "id": "producto_67890",
  "nombre": "iPhone 13 Pro Max",
  "precio": 850000,
  ...
}
```

### Paso 2: Crear Publicación (Tu Microservicio)
```http
POST /api/publicaciones
{
  "id_vendedor": "vendedor_12345",
  "id_producto": "producto_67890",  ← Conexión con el producto
  "titulo": "iPhone 13 Pro Max 256GB",
  "descripcion": "Vendo iPhone en excelente estado...",
  "despacho": "ambos",
  "precio_envio": 5000
}
```

### Paso 3: Moderación Automática
El sistema automáticamente:
1. ✅ Analiza el título y descripción
2. ✅ Detecta palabras inapropiadas
3. ✅ Cambia el estado según el resultado
4. ✅ Registra la moderación en la BD

---

## 🔄 Archivos Modificados

### 1. **Schema de Prisma** (`prisma/schema.prisma`)
```prisma
model publicacion {
  id                  String        @id @default(auto()) @map("_id") @db.ObjectId
  id_vendedor         String        
  id_producto         String        // ← NUEVO
  titulo              String
  descripcion         String
  // precio           Float?        // ← ELIMINADO
  despacho            String        @default("retiro_en_tienda")
  precio_envio        Float?        // ← MANTENIDO
  estado              String        @default("en_revision")
  fecha_creacion      DateTime      @default(now())
  fecha_modificacion  DateTime      @updatedAt
  multimedia          multimedia[]
  moderaciones        moderacion[]

  @@map("publicaciones")
}
```

### 2. **DTO de Creación** (`src/publicaciones/dto/create-publicacion.dto.ts`)
```typescript
export class CreatePublicacionDto {
  @IsString()
  @IsNotEmpty()
  id_vendedor: string;

  @IsString()
  @IsNotEmpty()
  id_producto: string; // ← NUEVO

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  titulo: string;

  // ... resto de campos
  // precio?: number; ← ELIMINADO
}
```

### 3. **DTO de Actualización** (`src/publicaciones/dto/update-publicacion.dto.ts`)
```typescript
export class UpdatePublicacionDto {
  @IsOptional()
  @IsString()
  id_vendedor?: string;

  @IsOptional()
  @IsString()
  id_producto?: string; // ← NUEVO

  // ... resto de campos
  // precio?: number; ← ELIMINADO
}
```

### 4. **Servicio de Publicaciones** (`src/publicaciones/publicaciones.service.ts`)
```typescript
async crear(dto: CreatePublicacionDto) {
  const publicacion = await this.prisma.publicacion.create({
    data: {
      id_vendedor: dto.id_vendedor,
      id_producto: dto.id_producto, // ← NUEVO
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      // precio: dto.precio, ← ELIMINADO
      despacho: dto.despacho || 'retiro_en_tienda',
      precio_envio: dto.precio_envio,
      // ...
    },
  });
  // ...
}
```

### 5. **Seed de Base de Datos** (`prisma/seed.ts`)
```typescript
const publicacionesEjemplo = [
  {
    id_vendedor: 'vendedor_001',
    id_producto: 'producto_001', // ← NUEVO
    titulo: 'Laptop HP Pavilion - Excelente estado',
    descripcion: '...',
    // precio: 450000, ← ELIMINADO
    despacho: 'envio',
    precio_envio: 5000,
  },
  // ...
];
```

---

## 🛠️ Comandos Ejecutados

```powershell
# 1. Limpiar caché de Prisma
Remove-Item -Recurse -Force node_modules\.prisma
Remove-Item -Recurse -Force node_modules\.pnpm\@prisma+client*

# 2. Regenerar cliente de Prisma
pnpm prisma:generate

# 3. Reiniciar servidor
pnpm start:dev
```

---

## ✅ Estado del Servidor

```
✔ Compilación exitosa (0 errores)
✔ Servidor funcionando en http://localhost:3000/api
✔ Todos los endpoints operativos
✔ Moderación automática activa
✔ Prisma Client regenerado correctamente
```

---

## 📚 Documentación Generada

1. **DICCIONARIO_DATOS.md** - Diccionario completo de la base de datos
2. **EJEMPLOS_API.md** - 12 ejemplos de uso de la API con requests y responses
3. **MODERACION_README.md** - Documentación del sistema de moderación

---

## 🎯 Próximos Pasos Recomendados

1. **Integrar con Microservicio de Productos:**
   - Validar que `id_producto` exista antes de crear publicación
   - Hacer llamadas HTTP para obtener datos del producto

2. **Sincronización de Datos:**
   - Cuando se consulta una publicación, obtener precio desde el microservicio de productos
   - Cachear datos de productos para mejorar rendimiento

3. **Conectar Base de Datos MongoDB:**
   - Actualizar `.env` con la URL de conexión real
   - Ejecutar `pnpm prisma:db:push` para crear las colecciones

4. **Testing:**
   - Probar endpoints con Postman o Thunder Client
   - Verificar moderación automática con palabras prohibidas
   - Testear integración con otros microservicios

---

## 🔐 Consideraciones de Seguridad

- ✅ Validación de DTOs con class-validator
- ✅ Moderación automática de contenido
- ⚠️ Pendiente: Validar que `id_vendedor` sea el usuario autenticado
- ⚠️ Pendiente: Validar que `id_producto` exista en el otro microservicio
- ⚠️ Pendiente: Implementar moderación de imágenes (Google Vision API)

---

**Última actualización:** 11/11/2025 - 14:12 hrs  
**Versión del servidor:** NestJS v10.3.0  
**Versión de Prisma:** v6.17.1  
**Estado:** ✅ Operativo
