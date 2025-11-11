# 🚀 Backend NestJS - Microservicio de Publicaciones

**Proyecto:** GPI - Sistema de Marketplace  
**Equipo 2:** Microservicio de Publicaciones  
**Universidad:** Universidad de Valparaíso  
**Versión:** 2.0 (Noviembre 2025)

---

## 👥 Grupo 2: Roles
- **Yoselin Cornejo** - yoselin.cornejo@estudiantes.uv.cl - UI/UX
- **Stefanny Montero** - stefanny.montero@estudiantes.uv.cl - UI/UX
- **Andrés Gonzalez** - andres.gonzalezvi@estudiantes.uv.cl - Back End y Servicios
- **Daniel Belozo** - daniel.belozo@estudiantes.uv.cl - Base de Datos
- **Lorena Uribe** - lorena.uribe@estudiantes.uv.cl - Seguridad/Gestión

---

## 📋 Descripción del Proyecto

Este backend proporciona una API RESTful completa para gestionar **publicaciones de productos** en un marketplace universitario. Incluye:

✅ **Sistema de moderación automática** con detección de contenido inapropiado  
✅ **Gestión completa de publicaciones** (CRUD)  
✅ **Almacenamiento de imágenes** en Cloudinary  
✅ **Base de datos MongoDB** con Prisma ORM  
✅ **Arquitectura de microservicios** lista para escalar  

---

## 🔌 Información de Puertos

| Servicio | Puerto/URL | Estado |
|----------|------------|--------|
| **Backend NestJS** | `http://localhost:3000/api` | ✅ Operativo |
| **MongoDB Atlas** | Cloud (sin puerto local) | ✅ Conectado |
| **Cloudinary** | API Externa | ✅ Configurado |
| **Frontend (esperado)** | `http://localhost:5173` | CORS Habilitado |

---

## 🚀 Tecnologías

## 🚀 Tecnologías

- **NestJS v10.3.0** - Framework para Node.js
- **TypeScript v5.3.3** - JavaScript con tipos
- **MongoDB Atlas** - Base de datos NoSQL en la nube
- **Prisma v6.17.1** - ORM moderno para TypeScript
- **Cloudinary** - Almacenamiento de imágenes
- **Class Validator** - Validación de DTOs
- **pnpm** - Gestor de paquetes rápido

---

## 🎯 Características Principales

### �️ Sistema de Moderación Automática
- Detecta **60+ palabras prohibidas** en español chileno
- Categorías: Drogas, Armas, Contenido Sexual, Fraude, Palabras Soeces
- Moderación en tiempo real (< 1 segundo)
- Registro completo de historial de moderación
- Moderación manual por administradores

### 📊 Gestión de Publicaciones
- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Soft delete (eliminación lógica)
- Estados: borrador, en_revision, activo, pausado, vendido, rechazado, eliminado
- Multimedia (múltiples imágenes por publicación)
- Integración con microservicio de productos

### ☁️ Almacenamiento de Imágenes
- Subida a Cloudinary
- URLs optimizadas y CDN
- Eliminación automática al borrar publicación

---

## 📁 Estructura de Carpetas

```
backend/
├── docs/                            # Documentación técnica
│   ├── diagramas/                   # Diagramas de flujo
│   └── endpoints/                   # Especificación OpenAPI
├── prisma/
│   ├── schema.prisma                # Schema de base de datos
│   └── seed.ts                      # Datos de prueba
├── src/
│   ├── main.ts                      # Punto de entrada
│   ├── app.module.ts                # Módulo principal
│   ├── config/                      # Configuraciones
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── cloudinary.config.ts
│   ├── prisma/                      # Módulo Prisma
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── publicaciones/               # 🎯 Módulo principal
│   │   ├── publicaciones.module.ts
│   │   ├── publicaciones.controller.ts
│   │   ├── publicaciones.service.ts
│   │   └── dto/
│   │       ├── create-publicacion.dto.ts
│   │       └── update-publicacion.dto.ts
│   ├── moderacion/                  # 🛡️ Sistema de moderación
│   │   ├── moderacion.module.ts
│   │   └── moderacion.service.ts
│   ├── cloudinary/                  # ☁️ Servicio de imágenes
│   │   ├── cloudinary.module.ts
│   │   ├── cloudinary.service.ts
│   │   └── cloudinary.provider.ts
│   └── auth/                        # 🔐 Autenticación
│       ├── auth.module.ts
│       ├── auth.controller.ts
│       └── auth.service.ts
├── DICCIONARIO_DATOS.md             # 📊 Estructura de BD
├── EJEMPLOS_API.md                  # 📡 Ejemplos de uso
├── FRONTEND_INTEGRATION_GUIDE.md    # 🎨 Guía para frontend
├── INFORME_PRUEBAS_MODERACION.md    # 🧪 Resultados de pruebas
├── MODERACION_README.md             # 🛡️ Doc. moderación
├── PUERTOS_Y_CONFIG.md              # 🔌 Resumen de configuración
└── .env                             # Variables de entorno
```

---

## ⚙️ Instalación y Configuración

## ⚙️ Instalación y Configuración

### Requisitos Previos

- **Node.js** v20.17.0 o superior
- **pnpm** v10.14.0 o superior ([Instrucciones de instalación](https://pnpm.io/installation))
- **MongoDB Atlas** (cuenta gratuita) o MongoDB local

### Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd GPI_BackTemplate
   ```

2. **Instalar dependencias con pnpm:**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno:**
   
   Crear archivo `.env` en la raíz:
   ```env
   # Backend
   PORT=3000
   NODE_ENV=development
   
   # MongoDB
   DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/dbname"
   
   # JWT
   JWT_SECRET="EstoEsUnSecretoSuperSeguroParaElCursoGPI"
   JWT_EXPIRES_IN=1d
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME="tu_cloud_name"
   CLOUDINARY_API_KEY="tu_api_key"
   CLOUDINARY_API_SECRET="tu_api_secret"
   CLOUDINARY_FOLDER=pulgashop/publicaciones
   ```

4. **Generar Prisma Client:**
   ```bash
   pnpm prisma:generate
   ```

5. **(Opcional) Seed de datos de prueba:**
   ```bash
   pnpm prisma:seed
   ```

### Ejecución

**Modo Desarrollo:**
```bash
pnpm start:dev
```
Servidor en: `http://localhost:3000/api`

**Modo Producción:**
```bash
pnpm build
pnpm start:prod
```

**Prisma Studio (Base de datos visual):**
```bash
pnpm prisma:studio
```

---

## 🌐 Endpoints Principales

### Publicaciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/publicaciones` | Crear publicación (con moderación automática) |
| GET | `/api/publicaciones` | Listar todas las publicaciones |
| GET | `/api/publicaciones/:id` | Obtener detalles de una publicación |
| PUT | `/api/publicaciones/:id` | Actualizar publicación |
| DELETE | `/api/publicaciones/:id` | Eliminar (soft delete) |
| PATCH | `/api/publicaciones/:id/estado` | Cambiar estado |
| POST | `/api/publicaciones/:id/multimedia` | Agregar imagen/video |
| DELETE | `/api/publicaciones/multimedia/:id` | Eliminar multimedia |
| GET | `/api/publicaciones/:id/moderacion` | Ver historial de moderación |
| POST | `/api/publicaciones/:id/moderacion` | Moderación manual (admin) |

### Ejemplo de Creación de Publicación

```typescript
// Request
POST /api/publicaciones
Content-Type: application/json

{
  "id_vendedor": "vendedor_12345",
  "id_producto": "producto_67890",
  "titulo": "iPhone 13 Pro Max 256GB",
  "descripcion": "Vendo iPhone en excelente estado, con caja original.",
  "despacho": "ambos",
  "precio_envio": 5000
}

// Response (Aprobada)
{
  "id": "673285f6a1b2c3d4e5f67890",
  "estado": "activo",
  "moderaciones": [
    {
      "tipo_moderacion": "automatica",
      "accion": "aprobado",
      "motivo": "Publicación aprobada automáticamente. No se detectaron problemas.",
      "palabras_detectadas": []
    }
  ]
}

// Response (Rechazada)
{
  "id": "673285f6a1b2c3d4e5f67891",
  "estado": "rechazado",
  "moderaciones": [
    {
      "tipo_moderacion": "automatica",
      "accion": "rechazado",
      "motivo": "Contenido inapropiado detectado. Palabras prohibidas: marihuana",
      "palabras_detectadas": ["marihuana"]
    }
  ]
}
```

---

## 🛡️ Sistema de Moderación

### Funcionamiento

1. **Automática:** Se ejecuta al crear/actualizar publicación
2. **Analiza:** Título y descripción
3. **Detecta:** 60+ palabras prohibidas en 5 categorías
4. **Acción:** Aprueba o rechaza automáticamente

### Categorías de Detección

- 💊 **Drogas** (13 palabras): marihuana, cocaína, pasta base, etc.
- 🔫 **Armas** (11 palabras): pistola, fusil, granada, etc.
- 🔞 **Contenido Sexual** (8 palabras): prostitución, escort, etc.
- 💰 **Fraude** (9 palabras): estafa, pirámide, lavado de dinero, etc.
- 🤬 **Palabras Soeces** (20+ palabras): vocabulario inapropiado chileno

### Estados de Publicación

| Estado | Descripción |
|--------|-------------|
| `borrador` | Guardada sin publicar |
| `en_revision` | Pendiente de revisión |
| `activo` | Visible para compradores |
| `pausado` | Temporalmente oculta |
| `vendido` | Producto vendido |
| `rechazado` | Bloqueada por moderación |
| `eliminado` | Eliminada (soft delete) |

---

## 🔄 Integración con el Frontend

## 🔄 Integración con el Frontend

### Configuración Axios (Recomendada)

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para token (si usas autenticación)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Ejemplo de Uso

```typescript
import api from './services/api';

// Crear publicación
const crearPublicacion = async (datos) => {
  try {
    const response = await api.post('/publicaciones', datos);
    
    // Verificar moderación
    if (response.data.estado === 'rechazado') {
      const moderacion = response.data.moderaciones[0];
      alert(`Rechazada: ${moderacion.motivo}\nPalabras: ${moderacion.palabras_detectadas.join(', ')}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Listar publicaciones
const obtenerPublicaciones = async () => {
  const response = await api.get('/publicaciones');
  return response.data;
};
```

**📖 Ver guía completa:** `FRONTEND_INTEGRATION_GUIDE.md`

---

## 📚 Documentación Adicional

| Documento | Descripción |
|-----------|-------------|
| **DICCIONARIO_DATOS.md** | Estructura completa de la base de datos |
| **EJEMPLOS_API.md** | 12 ejemplos de uso con requests/responses |
| **FRONTEND_INTEGRATION_GUIDE.md** | Guía completa para el equipo frontend |
| **INFORME_PRUEBAS_MODERACION.md** | Resultados de pruebas del sistema |
| **MODERACION_README.md** | Documentación detallada del sistema de moderación |
| **PUERTOS_Y_CONFIG.md** | Resumen rápido de configuración |
| **RESUMEN_CAMBIOS.md** | Historial de cambios v2.0 |

---

## 🧪 Resultados de Pruebas

### ✅ Sistema de Moderación Probado

| Prueba | Resultado | Estado Final |
|--------|-----------|--------------|
| Publicación válida | ✅ Aprobada | `activo` |
| Contenido con drogas | ❌ Rechazada | `rechazado` |
| Contenido con armas | ❌ Rechazada | `rechazado` |
| Historial de moderación | ✅ Exitosa | N/A |
| Moderación manual | ✅ Registrada | N/A |

**Tasa de éxito:** 5/5 (100%)  
**Tiempo de respuesta:** < 1 segundo

---

## 🏗️ Arquitectura de Microservicios

```
┌─────────────────────────┐
│ Microservicio USUARIOS  │
│  - Autenticación        │
│  - Gestión de usuarios  │
└───────────┬─────────────┘
            │ id_vendedor
            ▼
┌─────────────────────────┐        ┌──────────────────────────┐
│ Microservicio PRODUCTOS │◄───────┤ Microservicio            │
│  - Datos del producto   │        │ PUBLICACIONES (ESTE)     │
│  - Precio               │ id_producto  - Visualización    │
│  - Stock                │        │  - Moderación            │
└─────────────────────────┘        │  - Multimedia            │
                                   │  - Despacho              │
                                   └──────────────────────────┘
```

---

## 🧠 Conceptos Clave

### DTOs (Data Transfer Objects)

Validan automáticamente los datos recibidos:

```typescript
export class CreatePublicacionDto {
  @IsString()
  @IsNotEmpty()
  id_vendedor: string;

  @IsString()
  @IsNotEmpty()
  id_producto: string;

  @IsString()
  @MinLength(5)
  @MaxLength(100)
  titulo: string;

  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  descripcion: string;
}
```

### Prisma Schema

Define la estructura de la base de datos:

```prisma
model publicacion {
  id                  String        @id @default(auto()) @map("_id") @db.ObjectId
  id_vendedor         String
  id_producto         String
  titulo              String
  descripcion         String
  despacho            String        @default("retiro_en_tienda")
  precio_envio        Float?
  estado              String        @default("en_revision")
  fecha_creacion      DateTime      @default(now())
  fecha_modificacion  DateTime      @updatedAt
  multimedia          multimedia[]
  moderaciones        moderacion[]
}
```

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
pnpm start:dev              # Iniciar en modo desarrollo

# Base de datos
pnpm prisma:generate        # Generar Prisma Client
pnpm prisma:studio          # Abrir Prisma Studio
pnpm prisma:seed            # Seed de datos de prueba
pnpm prisma:db:push         # Sincronizar schema con BD

# Producción
pnpm build                  # Compilar proyecto
pnpm start:prod             # Iniciar en producción

# Testing
pnpm test                   # Ejecutar tests
pnpm test:cov               # Tests con cobertura
```

---

## ⚠️ Notas Importantes

- ✅ **CORS habilitado** para `http://localhost:5173`
- ⚠️ Cambiar `JWT_SECRET` en producción
- ⚠️ Implementar rate limiting para producción
- ⚠️ Validar `id_producto` contra microservicio de productos
- ⚠️ Implementar moderación de imágenes (Google Vision API)

---

## 📞 Soporte y Contacto

Para dudas o problemas, contactar al equipo:
- **Backend:** Andrés Gonzalez
- **Base de Datos:** Daniel Belozo
- **Seguridad:** Lorena Uribe

---

## 📄 Licencia

Este proyecto es desarrollado para la asignatura de **Gestión de Proyecto Informático**

**Profesores:**  
- Diego Monsalves  
- René Noël  

**Universidad de Valparaíso** - 2025
