# 🔌 Resumen de Puertos y Configuración - GPI Backend

**Proyecto:** Microservicio de Publicaciones  
**Fecha:** 11/11/2025

---

## 📡 PUERTOS Y URLS

### 🟢 Backend NestJS
```
Puerto: 3000
URL Local: http://localhost:3000/api
Estado: ✅ ACTIVO
```

### 🟡 MongoDB Atlas (Prisma)
```
Puerto: N/A (servicio en la nube)
Host: pulgashoppost.7txazxa.mongodb.net
Base de datos: pulgashop
ORM: Prisma v6.17.1
Estado: ✅ CONECTADO
```

### 🟣 Cloudinary
```
Puerto: N/A (servicio externo)
Cloud Name: dsth3bwpq
Carpeta: pulgashop/publicaciones
URLs: https://res.cloudinary.com/dsth3bwpq/...
Estado: ✅ CONFIGURADO
```

### 🔵 Frontend (Esperado)
```
Puerto: 5173 (Vite por defecto)
URL: http://localhost:5173
CORS: ✅ Habilitado en backend
```

---

## 🚀 COMANDOS RÁPIDOS

### Iniciar Backend
```bash
cd GPI_BackTemplate
pnpm start:dev
```

### Regenerar Prisma Client
```bash
pnpm prisma:generate
```

### Ver Base de Datos (Prisma Studio)
```bash
pnpm prisma:studio
```

### Seed de Datos
```bash
pnpm prisma:seed
```

---

## 📋 ENDPOINTS PRINCIPALES

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/publicaciones` | Crear publicación (con moderación automática) |
| GET | `/api/publicaciones` | Listar todas las publicaciones |
| GET | `/api/publicaciones/:id` | Obtener una publicación |
| PUT | `/api/publicaciones/:id` | Actualizar publicación |
| DELETE | `/api/publicaciones/:id` | Eliminar (soft delete) |
| PATCH | `/api/publicaciones/:id/estado` | Cambiar estado |
| GET | `/api/publicaciones/:id/moderacion` | Ver historial de moderación |
| POST | `/api/publicaciones/:id/moderacion` | Moderación manual |

---

## 🛡️ SISTEMA DE MODERACIÓN

### Estados Posibles
- `borrador` - No publicada
- `en_revision` - Pendiente
- `activo` - Visible ✅
- `pausado` - Oculta temporalmente
- `vendido` - Producto vendido
- `rechazado` - Bloqueada por moderación ❌
- `eliminado` - Soft delete

### Categorías de Detección
- 💊 Drogas (13 palabras)
- 🔫 Armas (11 palabras)
- 🔞 Contenido sexual (8 palabras)
- 💰 Fraude (9 palabras)
- 🤬 Palabras soeces (20+ palabras)

**Total:** 60+ palabras prohibidas

---

## 📁 DOCUMENTACIÓN DISPONIBLE

| Archivo | Contenido |
|---------|-----------|
| `DICCIONARIO_DATOS.md` | Estructura completa de la BD |
| `EJEMPLOS_API.md` | 12 ejemplos de uso con requests/responses |
| `FRONTEND_INTEGRATION_GUIDE.md` | Guía completa para frontend |
| `INFORME_PRUEBAS_MODERACION.md` | Resultados de pruebas del sistema |
| `MODERACION_README.md` | Documentación del sistema de moderación |
| `RESUMEN_CAMBIOS.md` | Historial de cambios v2.0 |

---

## 🔐 VARIABLES DE ENTORNO (.env)

```env
# Backend
PORT=3000
NODE_ENV=development

# MongoDB
DATABASE_URL="mongodb+srv://..."

# JWT
JWT_SECRET="EstoEsUnSecretoSuperSeguroParaElCursoGPI"
JWT_EXPIRES_IN=1d

# Cloudinary
CLOUDINARY_CLOUD_NAME="dsth3bwpq"
CLOUDINARY_API_KEY="882199849694792"
CLOUDINARY_API_SECRET="qOIdsHqbBcp49ADslW7iZyNz2DY"
CLOUDINARY_FOLDER=pulgashop/publicaciones
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [x] Backend funcionando en puerto 3000
- [x] MongoDB conectado
- [x] Cloudinary configurado
- [x] Sistema de moderación activo
- [x] Prisma Client generado
- [x] CORS habilitado para frontend
- [x] Endpoints probados
- [x] Documentación completa

---

## 📞 INTEGRACIÓN FRONTEND

### Configuración Axios
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});

export default api;
```

### Crear Publicación
```typescript
const response = await api.post('/publicaciones', {
  id_vendedor: 'user_123',
  id_producto: 'prod_456',
  titulo: 'iPhone 13 Pro',
  descripcion: 'En excelente estado...',
  despacho: 'ambos',
  precio_envio: 5000
});

// Verificar moderación
if (response.data.estado === 'rechazado') {
  console.log('Rechazada:', response.data.moderaciones[0].motivo);
}
```

---

## 🎯 PRÓXIMOS PASOS

1. **Frontend:** Integrar endpoints desde `http://localhost:3000/api`
2. **Testing:** Probar moderación con palabras prohibidas
3. **Validación:** Implementar validaciones antes de enviar
4. **UI/UX:** Mostrar estados de moderación claramente
5. **Imágenes:** Integrar subida a Cloudinary
6. **Productos:** Conectar con microservicio de productos

---

**Última actualización:** 11/11/2025 - 17:25 hrs  
**Estado general:** ✅ TODO OPERATIVO
