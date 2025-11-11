# 📊 Diccionario de Datos - Microservicio de Publicaciones

**Fecha de creación:** 11 de Noviembre 2025  
**Versión:** 1.0  
**Sistema gestor de base de datos:** MongoDB  
**Proyecto:** GPI - Microservicio de Publicaciones

---

## Tabla: **publicaciones**

| Nombre del Atributo | Tipo de Dato | NULL/NOT NULL | PK/FK | Descripción |
|---------------------|--------------|---------------|-------|-------------|
| `id` | ObjectId | NOT NULL | PK | Identificador único de la publicación. Generado automáticamente por MongoDB. |
| `id_vendedor` | String | NOT NULL | FK | Identificador del vendedor que crea la publicación. Referencia externa al microservicio de usuarios. |
| `id_producto` | String | NOT NULL | FK | Identificador del producto asociado a la publicación. Referencia externa al microservicio de productos. |
| `titulo` | String | NOT NULL | - | Título de la publicación. Mínimo 5 caracteres, máximo 100 caracteres. |
| `descripcion` | String | NOT NULL | - | Descripción detallada de la publicación. Mínimo 10 caracteres, máximo 1000 caracteres. |
| `despacho` | String | NOT NULL | - | Tipo de despacho disponible. Valores permitidos: `'retiro_en_tienda'`, `'envio'`, `'ambos'`. Valor por defecto: `'retiro_en_tienda'`. |
| `precio_envio` | Float | NULL | - | Precio del envío si aplica. Campo opcional. Debe ser mayor o igual a 0. |
| `estado` | String | NOT NULL | - | Estado actual de la publicación. Valores permitidos: `'borrador'`, `'en_revision'`, `'activo'`, `'pausado'`, `'vendido'`, `'rechazado'`, `'eliminado'`. Valor por defecto: `'en_revision'`. |
| `fecha_creacion` | DateTime | NOT NULL | - | Fecha y hora de creación de la publicación. Generado automáticamente. |
| `fecha_modificacion` | DateTime | NOT NULL | - | Fecha y hora de la última modificación. Actualizado automáticamente. |

**Relaciones:**
- Una publicación tiene muchas multimedia (1:N)
- Una publicación tiene muchas moderaciones (1:N)

---

## Tabla: **multimedia**

| Nombre del Atributo | Tipo de Dato | NULL/NOT NULL | PK/FK | Descripción |
|---------------------|--------------|---------------|-------|-------------|
| `id` | ObjectId | NOT NULL | PK | Identificador único del elemento multimedia. Generado automáticamente. |
| `id_publicacion` | ObjectId | NOT NULL | FK | Identificador de la publicación a la que pertenece el archivo multimedia. Relación con `publicaciones.id`. Eliminación en cascada. |
| `url` | String | NOT NULL | - | URL completa del archivo multimedia almacenado en Cloudinary. |
| `cloudinary_public_id` | String | NULL | - | Identificador público de Cloudinary. Necesario para eliminar la imagen del servidor. Campo opcional. |
| `orden` | Integer | NOT NULL | - | Número de orden para organizar la secuencia de visualización. Valor por defecto: `0`. |
| `tipo` | String | NOT NULL | - | Tipo de archivo multimedia. Valores permitidos: `'imagen'` o `'video'`. Valor por defecto: `'imagen'`. |

**Relaciones:**
- Muchas multimedia pertenecen a una publicación (N:1)

---

## Tabla: **moderaciones**

| Nombre del Atributo | Tipo de Dato | NULL/NOT NULL | PK/FK | Descripción |
|---------------------|--------------|---------------|-------|-------------|
| `id` | ObjectId | NOT NULL | PK | Identificador único del registro de moderación. Generado automáticamente. |
| `id_publicacion` | ObjectId | NOT NULL | FK | Identificador de la publicación moderada. Relación con `publicaciones.id`. Eliminación en cascada. |
| `id_moderador` | String | NULL | - | Identificador del administrador que realizó la moderación manual. Es `null` cuando la moderación es automática. |
| `tipo_moderacion` | String | NOT NULL | - | Tipo de moderación realizada. Valores permitidos: `'automatica'` o `'manual'`. |
| `accion` | String | NOT NULL | - | Resultado de la moderación. Valores permitidos: `'aprobado'` o `'rechazado'`. |
| `motivo` | String | NOT NULL | - | Descripción del motivo de aprobación o rechazo de la publicación. |
| `palabras_detectadas` | String[] | NOT NULL | - | Array de palabras inapropiadas detectadas en el título o descripción. Por defecto array vacío `[]`. |
| `contenido_detectado` | String[] | NOT NULL | - | Array de tipos de contenido ilícito detectado. Valores posibles: `'sexual'`, `'armas'`, `'drogas'`, `'fraude'`, etc. Por defecto array vacío `[]`. |
| `fecha` | DateTime | NOT NULL | - | Fecha y hora en que se realizó la moderación. Generado automáticamente. |

**Relaciones:**
- Muchas moderaciones pertenecen a una publicación (N:1)

---

## 🔗 Relaciones entre Tablas

```
publicaciones (1) ←──→ (N) multimedia
publicaciones (1) ←──→ (N) moderaciones
```

---

## 📌 Índices y Claves

### Claves Primarias:
- `publicaciones._id`
- `multimedia._id`
- `moderaciones._id`

### Claves Foráneas Internas:
- `multimedia.id_publicacion` → `publicaciones.id`
- `moderaciones.id_publicacion` → `publicaciones.id`

### Claves Foráneas Externas (Referencias a otros microservicios):
- `publicaciones.id_vendedor` → **Microservicio de Usuarios**
- `publicaciones.id_producto` → **Microservicio de Productos**

---

## 🔒 Reglas de Integridad Referencial

### Eliminación en Cascada (ON DELETE CASCADE):
- Al eliminar una **publicación**, se eliminan automáticamente:
  - Todos los registros de **multimedia** asociados
  - Todos los registros de **moderaciones** asociados

### Validaciones de Negocio:

#### Publicaciones:
- `titulo`: Longitud entre 5 y 100 caracteres
- `descripcion`: Longitud entre 10 y 1000 caracteres
- `despacho`: Solo valores: `'retiro_en_tienda'`, `'envio'`, `'ambos'`
- `precio_envio`: Debe ser ≥ 0 (si se proporciona)
- `estado`: Solo valores válidos del enum definido

#### Multimedia:
- `orden`: Debe ser ≥ 0
- `tipo`: Solo `'imagen'` o `'video'`

#### Moderaciones:
- `tipo_moderacion`: Solo `'automatica'` o `'manual'`
- `accion`: Solo `'aprobado'` o `'rechazado'`

---

## 📊 Estadísticas del Esquema

| Tabla | Número de Atributos | Relaciones |
|-------|---------------------|------------|
| publicaciones | 10 | 2 salientes (multimedia, moderaciones) |
| multimedia | 6 | 1 entrante (publicaciones) |
| moderaciones | 9 | 1 entrante (publicaciones) |
| **TOTAL** | **25 atributos** | **3 relaciones** |

---

## 🔄 Diagrama de Flujo de Estados (Publicaciones)

```
┌──────────┐
│ borrador │
└────┬─────┘
     │
     v
┌─────────────┐     ┌───────────┐
│ en_revision │────→│ rechazado │
└──────┬──────┘     └───────────┘
       │
       v
   ┌────────┐
   │ activo │←──┐
   └───┬────┘   │
       │        │
       ├────────┘
       │
       ├───→ ┌─────────┐
       │     │ pausado │
       │     └─────────┘
       │
       └───→ ┌─────────┐
             │ vendido │
             └─────────┘
             
       ┌───────────┐
       │ eliminado │ (soft delete)
       └───────────┘
```

---

## 🛡️ Sistema de Moderación Automática

### Palabras Indebidas Detectadas (Español Chileno):
El sistema detecta automáticamente más de **60 términos inapropiados** categorizados en:

1. **Palabras soeces y vulgares**
2. **Términos relacionados con drogas** (marihuana, cocaína, pasta base, etc.)
3. **Términos relacionados con armas** (pistola, fusil, granada, etc.)
4. **Contenido sexual explícito**
5. **Términos de fraude** (estafa, pirámide, lavado de dinero, etc.)

### Proceso de Moderación Automática:
1. Al crear/actualizar una publicación, el sistema analiza `titulo` y `descripcion`
2. Si detecta palabras indebidas:
   - Cambia el estado a `'rechazado'`
   - Crea un registro en `moderaciones` con `tipo_moderacion='automatica'`
   - Registra las `palabras_detectadas` y `contenido_detectado`
3. Si no detecta problemas, permite la publicación con estado `'en_revision'`

---

## 📝 Notas Técnicas

- **Motor de Base de Datos:** MongoDB (NoSQL)
- **ORM Utilizado:** Prisma v6.17.1
- **Almacenamiento de Imágenes:** Cloudinary
- **Arquitectura:** Microservicios independientes
- **Eliminación:** Soft delete mediante cambio de `estado` a `'eliminado'`
- **Auditoria:** Campos `fecha_creacion` y `fecha_modificacion` automáticos

---

**Documento generado automáticamente por el sistema**  
*Última actualización: 11/11/2025*
