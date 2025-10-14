# Backend - Sistema de Publicaciones con Prisma y MongoDB

Este backend está construido con NestJS y utiliza Prisma como ORM para conectarse a MongoDB Atlas.

## 🚀 Tecnologías

- **NestJS** - Framework backend
- **Prisma** - ORM para MongoDB
- **MongoDB Atlas** - Base de datos NoSQL
- **TypeScript** - Lenguaje de programación

## 📊 Modelos de Base de Datos

### Categoria
- `id`: ObjectId (PK)
- `nombre`: String (único)
- `descripcion`: String (opcional)
- `icono`: String (opcional)
- `activa`: Boolean (default: true)
- `fechaCreacion`: DateTime
- Relaciones: `publicaciones[]`

### Publicacion
- `id`: ObjectId (PK)
- `id_vendedor`: String (referencia externa)
- `id_producto`: String (opcional)
- `titulo`: String
- `descripcion`: String
- `categoriaId`: ObjectId (FK)
- `estado`: String (default: "EN REVISION")
- `fechaCreacion`: DateTime
- `fechaModificacion`: DateTime
- Relaciones: `categoria`, `multimedia[]`, `moderaciones[]`

### Multimedia
- `id`: ObjectId (PK)
- `id_publicacion`: ObjectId (FK)
- `url`: String
- `orden`: Int
- `tipo`: String (default: "imagen")
- Relaciones: `publicacion`

### Moderacion
- `id`: ObjectId (PK)
- `id_publicacion`: ObjectId (FK)
- `id_moderador`: String (opcional)
- `accion`: String ("APROBADO" o "RECHAZADO")
- `comentario`: String
- `fecha`: DateTime
- Relaciones: `publicacion`

## ⚙️ Configuración

### 1. Variables de Entorno

Asegúrate de tener configurado el archivo `.env`:

```env
DATABASE_URL="mongodb+srv://usuario:password@cluster.mongodb.net/database?retryWrites=true&w=majority"
JWT_SECRET=tu_secreto_jwt
PORT=3000
```

### 2. Instalación de Dependencias

```bash
pnpm install
```

### 3. Generar Cliente de Prisma

```bash
pnpm prisma:generate
```

### 4. Sincronizar Esquema con MongoDB

```bash
pnpm prisma:push
```

### 5. Poblar Base de Datos (Seed)

```bash
pnpm prisma:seed
```

Esto creará categorías iniciales como Electrónica, Moda, Hogar, Deportes, etc.

## 📡 Endpoints Disponibles

### Categorías

#### GET `/categorias`
Lista todas las categorías

#### GET `/categorias/activas`
Lista solo las categorías activas

#### GET `/categorias/:id`
Obtiene una categoría específica con sus publicaciones

#### POST `/categorias`
Crea una nueva categoría

**Body:**
```json
{
  "nombre": "Nombre de la categoría",
  "descripcion": "Descripción opcional",
  "icono": "nombre-icono",
  "activa": true
}
```

#### PUT `/categorias/:id`
Actualiza una categoría existente

#### DELETE `/categorias/:id`
Elimina una categoría (solo si no tiene publicaciones)

#### PATCH `/categorias/:id/activar`
Activa una categoría

#### PATCH `/categorias/:id/desactivar`
Desactiva una categoría

---

### Publicaciones

#### GET `/publicaciones`
Lista todas las publicaciones con categoría y multimedia

#### GET `/publicaciones/:id`
Obtiene una publicación específica con todos sus detalles

#### POST `/publicaciones`
Crea una nueva publicación

**Body:**
```json
{
  "id_vendedor": "vendedor123",
  "id_producto": "prod456",
  "titulo": "iPhone 15 Pro Max",
  "descripcion": "Smartphone de última generación...",
  "categoriaId": "ObjectId de la categoría",
  "multimedia": [
    {
      "url": "https://ejemplo.com/imagen1.jpg",
      "orden": 0,
      "tipo": "imagen"
    }
  ]
}
```

#### PUT `/publicaciones/:id`
Actualiza una publicación existente

#### DELETE `/publicaciones/:id`
Elimina una publicación (elimina automáticamente multimedia y moderaciones)

#### PATCH `/publicaciones/:id/estado`
Cambia el estado de una publicación

**Body:**
```json
{
  "estado": "ACTIVO"
}
```

**Estados posibles:**
- `EN REVISION` (default)
- `BORRADOR`
- `ACTIVO`
- `PAUSADO`
- `VENDIDO`
- `RECHAZADO`

#### POST `/publicaciones/:id/multimedia`
Agrega multimedia a una publicación

**Body:**
```json
{
  "url": "https://ejemplo.com/imagen.jpg",
  "orden": 1,
  "tipo": "imagen"
}
```

#### DELETE `/publicaciones/multimedia/:multimediaId`
Elimina un elemento multimedia específico

#### POST `/publicaciones/:id/moderacion`
Agrega un registro de moderación

**Body:**
```json
{
  "id_moderador": "moderador123",
  "accion": "APROBADO",
  "comentario": "Publicación aprobada sin observaciones"
}
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
pnpm start:dev

# Producción
pnpm build
pnpm start:prod

# Prisma
pnpm prisma:generate    # Genera el cliente de Prisma
pnpm prisma:push        # Sincroniza el esquema con la BD
pnpm prisma:studio      # Abre Prisma Studio (GUI)
pnpm prisma:seed        # Puebla la BD con datos iniciales

# Testing
pnpm test
pnpm test:watch
pnpm test:e2e
```

## 📝 Notas Importantes

1. **Microservicios**: Este backend está diseñado para funcionar como microservicio enfocado en publicaciones.

2. **Referencias Externas**: Los campos `id_vendedor` y `id_producto` son strings que referencian a otros microservicios.

3. **Cascade Delete**: Al eliminar una publicación, se eliminan automáticamente:
   - Todos los elementos multimedia asociados
   - Todos los registros de moderación asociados

4. **Validaciones**: Todos los DTOs incluyen validaciones con class-validator.

5. **Prisma Studio**: Para visualizar y editar datos de forma gráfica:
   ```bash
   pnpm prisma:studio
   ```

## 🔒 Seguridad

- Asegúrate de no commitear el archivo `.env` al repositorio
- Usa variables de entorno para información sensible
- Implementa guards de autenticación según sea necesario

## 👥 Para el Equipo Frontend

Los endpoints están listos para ser consumidos. Todos devuelven JSON y siguen las convenciones REST estándar.

### Ejemplo de respuesta de publicación:

```json
{
  "id": "507f1f77bcf86cd799439011",
  "id_vendedor": "vendedor123",
  "titulo": "iPhone 15 Pro Max",
  "descripcion": "Smartphone de última generación...",
  "estado": "EN REVISION",
  "fechaCreacion": "2025-10-14T10:30:00.000Z",
  "fechaModificacion": "2025-10-14T10:30:00.000Z",
  "categoria": {
    "id": "507f1f77bcf86cd799439012",
    "nombre": "Electrónica",
    "descripcion": "Dispositivos electrónicos..."
  },
  "multimedia": [
    {
      "id": "507f1f77bcf86cd799439013",
      "url": "https://ejemplo.com/imagen.jpg",
      "orden": 0,
      "tipo": "imagen"
    }
  ]
}
```

## 📚 Recursos

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de NestJS](https://docs.nestjs.com)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
