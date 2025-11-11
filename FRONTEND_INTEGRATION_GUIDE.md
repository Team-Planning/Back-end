# 🎨 Guía de Integración Frontend - API de Publicaciones

**Fecha:** 11 de Noviembre 2025  
**Versión:** 2.0  
**Equipo:** Frontend GPI

---

## 📡 Información de Conexión

### Backend (NestJS)
```
🌐 URL Base: http://localhost:3000/api
🔌 Puerto: 3000
📦 Framework: NestJS v10.3.0
🔐 CORS: Habilitado para http://localhost:5173
```

### Base de Datos (MongoDB - Prisma)
```
🗄️ Motor: MongoDB Atlas
🔧 ORM: Prisma v6.17.1
🌐 Cluster: PulgaShopPost.7txazxa.mongodb.net
📊 Base de datos: pulgashop
⚠️ No hay puerto local - está en la nube
```

### Cloudinary (Almacenamiento de Imágenes)
```
☁️ Servicio: Cloudinary
🌐 Cloud Name: dsth3bwpq
📁 Carpeta: pulgashop/publicaciones
⚠️ No hay puerto - es un servicio externo
🔗 URLs de imágenes: https://res.cloudinary.com/dsth3bwpq/...
```

---

## 🚀 Endpoints Disponibles

### Base URL
Todas las peticiones deben ir a: `http://localhost:3000/api`

---

## 1️⃣ Crear Publicación

### `POST /publicaciones`

**Headers:**
```javascript
{
  'Content-Type': 'application/json'
}
```

**Body (TypeScript):**
```typescript
interface CreatePublicacionDto {
  id_vendedor: string;        // REQUERIDO
  id_producto: string;         // REQUERIDO - Del microservicio de productos
  titulo: string;              // REQUERIDO - Min: 5, Max: 100 caracteres
  descripcion: string;         // REQUERIDO - Min: 10, Max: 1000 caracteres
  despacho?: string;           // OPCIONAL - 'retiro_en_tienda' | 'envio' | 'ambos' (default: 'retiro_en_tienda')
  precio_envio?: number;       // OPCIONAL - Solo si despacho incluye 'envio'
  estado?: string;             // OPCIONAL - Default: 'en_revision'
  multimedia?: Array<{         // OPCIONAL
    url: string;
    orden: number;
    tipo?: string;             // 'imagen' | 'video' (default: 'imagen')
  }>;
}
```

**Ejemplo con Axios:**
```typescript
import axios from 'axios';

const crearPublicacion = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/publicaciones', {
      id_vendedor: 'vendedor_12345',
      id_producto: 'producto_67890',
      titulo: 'iPhone 13 Pro Max 256GB',
      descripcion: 'Vendo iPhone 13 Pro Max en excelente estado, con caja original y accesorios.',
      despacho: 'ambos',
      precio_envio: 5000
    });
    
    console.log('Publicación creada:', response.data);
    
    // Verificar estado de moderación
    if (response.data.estado === 'rechazado') {
      console.error('Publicación rechazada:', response.data.moderaciones[0].motivo);
      console.log('Palabras detectadas:', response.data.moderaciones[0].palabras_detectadas);
    } else {
      console.log('Publicación aprobada!');
    }
  } catch (error) {
    console.error('Error:', error.response?.data);
  }
};
```

**Ejemplo con Fetch:**
```typescript
const crearPublicacion = async (publicacionData) => {
  const response = await fetch('http://localhost:3000/api/publicaciones', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(publicacionData)
  });
  
  if (!response.ok) {
    throw new Error('Error al crear publicación');
  }
  
  const data = await response.json();
  return data;
};
```

**Response (Aprobada):**
```json
{
  "id": "69136f4128f46d3277588b50",
  "id_vendedor": "vendedor_test_001",
  "id_producto": "producto_test_001",
  "titulo": "Laptop HP en excelente estado",
  "descripcion": "Vendo laptop HP Pavilion...",
  "despacho": "ambos",
  "precio_envio": 5000,
  "estado": "activo",
  "fecha_creacion": "2025-11-11T17:15:44.953Z",
  "fecha_modificacion": "2025-11-11T17:15:45.752Z",
  "multimedia": [],
  "moderaciones": [
    {
      "id": "69136f4128f46d3277588b51",
      "id_publicacion": "69136f4128f46d3277588b50",
      "id_moderador": null,
      "tipo_moderacion": "automatica",
      "accion": "aprobado",
      "motivo": "Publicación aprobada automáticamente. No se detectaron problemas.",
      "palabras_detectadas": [],
      "contenido_detectado": [],
      "fecha": "2025-11-11T17:15:45.542Z"
    }
  ]
}
```

**Response (Rechazada):**
```json
{
  "id": "69136f4e28f46d3277588b52",
  "id_vendedor": "vendedor_test_002",
  "id_producto": "producto_test_002",
  "titulo": "Vendo marihuana de calidad",
  "descripcion": "Producto de primera calidad...",
  "despacho": "envio",
  "precio_envio": 0,
  "estado": "rechazado",
  "fecha_creacion": "2025-11-11T17:15:58.261Z",
  "fecha_modificacion": "2025-11-11T17:15:58.718Z",
  "multimedia": [],
  "moderaciones": [
    {
      "id": "69136f4e28f46d3277588b53",
      "id_publicacion": "69136f4e28f46d3277588b52",
      "id_moderador": null,
      "tipo_moderacion": "automatica",
      "accion": "rechazado",
      "motivo": "Contenido inapropiado detectado. Palabras prohibidas encontradas: marihuana",
      "palabras_detectadas": ["marihuana"],
      "contenido_detectado": [],
      "fecha": "2025-11-11T17:15:58.52Z"
    }
  ]
}
```

---

## 2️⃣ Listar Publicaciones

### `GET /publicaciones`

**Ejemplo:**
```typescript
const obtenerPublicaciones = async () => {
  const response = await fetch('http://localhost:3000/api/publicaciones');
  const publicaciones = await response.json();
  return publicaciones;
};
```

**Response:**
```json
[
  {
    "id": "69136f4128f46d3277588b50",
    "id_vendedor": "vendedor_test_001",
    "id_producto": "producto_test_001",
    "titulo": "Laptop HP en excelente estado",
    "descripcion": "Vendo laptop HP Pavilion...",
    "despacho": "ambos",
    "precio_envio": 5000,
    "estado": "activo",
    "fecha_creacion": "2025-11-11T17:15:44.953Z",
    "fecha_modificacion": "2025-11-11T17:15:45.752Z",
    "multimedia": []
  }
]
```

---

## 3️⃣ Obtener Publicación por ID

### `GET /publicaciones/:id`

**Ejemplo:**
```typescript
const obtenerPublicacion = async (id: string) => {
  const response = await fetch(`http://localhost:3000/api/publicaciones/${id}`);
  const publicacion = await response.json();
  return publicacion;
};
```

---

## 4️⃣ Actualizar Publicación

### `PUT /publicaciones/:id`

**Ejemplo:**
```typescript
const actualizarPublicacion = async (id: string, datos: Partial<CreatePublicacionDto>) => {
  const response = await fetch(`http://localhost:3000/api/publicaciones/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos)
  });
  return response.json();
};

// Uso
await actualizarPublicacion('69136f4128f46d3277588b50', {
  titulo: 'Laptop HP - REBAJADA',
  precio_envio: 3000
});
```

---

## 5️⃣ Cambiar Estado

### `PATCH /publicaciones/:id/estado`

**Estados permitidos:**
- `borrador`
- `en_revision`
- `activo`
- `pausado`
- `vendido`
- `rechazado`
- `eliminado`

**Ejemplo:**
```typescript
const cambiarEstado = async (id: string, nuevoEstado: string) => {
  const response = await fetch(`http://localhost:3000/api/publicaciones/${id}/estado`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ estado: nuevoEstado })
  });
  return response.json();
};

// Pausar publicación
await cambiarEstado('69136f4128f46d3277588b50', 'pausado');

// Marcar como vendido
await cambiarEstado('69136f4128f46d3277588b50', 'vendido');
```

---

## 6️⃣ Eliminar Publicación (Soft Delete)

### `DELETE /publicaciones/:id`

**Ejemplo:**
```typescript
const eliminarPublicacion = async (id: string) => {
  const response = await fetch(`http://localhost:3000/api/publicaciones/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};
```

**Response:**
```json
{
  "mensaje": "Publicación eliminada exitosamente"
}
```

---

## 7️⃣ Agregar Multimedia

### `POST /publicaciones/:id/multimedia`

**Ejemplo:**
```typescript
const agregarImagen = async (publicacionId: string, imagen: {url: string, orden: number}) => {
  const response = await fetch(`http://localhost:3000/api/publicaciones/${publicacionId}/multimedia`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: imagen.url,
      orden: imagen.orden,
      tipo: 'imagen'
    })
  });
  return response.json();
};
```

---

## 8️⃣ Ver Historial de Moderación

### `GET /publicaciones/:id/moderacion`

**Ejemplo:**
```typescript
const obtenerHistorialModeracion = async (publicacionId: string) => {
  const response = await fetch(`http://localhost:3000/api/publicaciones/${publicacionId}/moderacion`);
  const historial = await response.json();
  return historial;
};
```

**Response:**
```json
[
  {
    "id": "69136f4e28f46d3277588b53",
    "id_publicacion": "69136f4e28f46d3277588b52",
    "id_moderador": null,
    "tipo_moderacion": "automatica",
    "accion": "rechazado",
    "motivo": "Contenido inapropiado detectado. Palabras prohibidas encontradas: marihuana",
    "palabras_detectadas": ["marihuana"],
    "contenido_detectado": [],
    "fecha": "2025-11-11T17:15:58.52Z"
  }
]
```

---

## 🛡️ Sistema de Moderación Automática

### ¿Cómo Funciona?

1. **Al crear/actualizar una publicación**, el sistema analiza automáticamente:
   - Título
   - Descripción

2. **Detecta palabras prohibidas** en categorías:
   - 💊 Drogas (marihuana, cocaína, pasta base, etc.)
   - 🔫 Armas (pistola, fusil, granada, etc.)
   - 🔞 Contenido sexual explícito
   - 💰 Fraude (estafa, pirámide, etc.)
   - 🤬 Palabras soeces (chileno)

3. **Si detecta problemas:**
   - ❌ Cambia estado a `'rechazado'`
   - 📝 Registra las palabras detectadas
   - 📊 Crea registro de moderación automática

4. **Si no detecta problemas:**
   - ✅ Cambia estado a `'activo'`
   - 📝 Registra aprobación automática

### Manejo en el Frontend

**Componente React - Ejemplo:**
```typescript
import { useState } from 'react';
import axios from 'axios';

interface ModeracionResult {
  estado: string;
  moderaciones: Array<{
    accion: string;
    motivo: string;
    palabras_detectadas: string[];
  }>;
}

const CrearPublicacionForm = () => {
  const [mensaje, setMensaje] = useState('');
  const [palabrasProhibidas, setPalabrasProhibidas] = useState<string[]>([]);
  
  const handleSubmit = async (formData: any) => {
    try {
      const response = await axios.post('http://localhost:3000/api/publicaciones', formData);
      
      // Verificar resultado de moderación
      if (response.data.estado === 'rechazado') {
        const moderacion = response.data.moderaciones[0];
        
        // Mostrar error al usuario
        setMensaje(`❌ ${moderacion.motivo}`);
        setPalabrasProhibidas(moderacion.palabras_detectadas);
        
        // Mostrar alerta
        alert(`Tu publicación fue rechazada por contener palabras inapropiadas: ${moderacion.palabras_detectadas.join(', ')}`);
        
      } else if (response.data.estado === 'activo') {
        setMensaje('✅ ¡Publicación creada exitosamente!');
        // Redirigir o mostrar mensaje de éxito
      }
      
    } catch (error) {
      console.error('Error al crear publicación:', error);
      setMensaje('❌ Error al crear la publicación');
    }
  };
  
  return (
    <div>
      {/* Tu formulario aquí */}
      
      {mensaje && <div className="alert">{mensaje}</div>}
      
      {palabrasProhibidas.length > 0 && (
        <div className="warning">
          <h4>Palabras detectadas:</h4>
          <ul>
            {palabrasProhibidas.map(palabra => (
              <li key={palabra}>{palabra}</li>
            ))}
          </ul>
          <p>Por favor, edita tu publicación y elimina estas palabras.</p>
        </div>
      )}
    </div>
  );
};
```

---

## 🎨 Componente de Ejemplo Completo (React + TypeScript)

```typescript
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

interface Publicacion {
  id: string;
  id_vendedor: string;
  id_producto: string;
  titulo: string;
  descripcion: string;
  despacho: string;
  precio_envio: number | null;
  estado: string;
  fecha_creacion: string;
  multimedia: any[];
  moderaciones?: Moderacion[];
}

interface Moderacion {
  id: string;
  tipo_moderacion: string;
  accion: string;
  motivo: string;
  palabras_detectadas: string[];
  fecha: string;
}

const PublicacionesList = () => {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarPublicaciones();
  }, []);

  const cargarPublicaciones = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/publicaciones`);
      setPublicaciones(response.data);
    } catch (err) {
      setError('Error al cargar publicaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const crearPublicacion = async (datos: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/publicaciones`, datos);
      
      // Verificar moderación
      if (response.data.estado === 'rechazado') {
        const moderacion = response.data.moderaciones[0];
        alert(`Publicación rechazada: ${moderacion.motivo}\nPalabras detectadas: ${moderacion.palabras_detectadas.join(', ')}`);
        return { success: false, data: response.data };
      }
      
      // Recargar lista
      await cargarPublicaciones();
      return { success: true, data: response.data };
      
    } catch (err) {
      console.error('Error:', err);
      return { success: false, error: err };
    }
  };

  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    try {
      await axios.patch(`${API_BASE_URL}/publicaciones/${id}/estado`, {
        estado: nuevoEstado
      });
      await cargarPublicaciones();
    } catch (err) {
      console.error('Error al cambiar estado:', err);
    }
  };

  const eliminarPublicacion = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta publicación?')) {
      try {
        await axios.delete(`${API_BASE_URL}/publicaciones/${id}`);
        await cargarPublicaciones();
      } catch (err) {
        console.error('Error al eliminar:', err);
      }
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="publicaciones-container">
      <h2>Publicaciones</h2>
      
      {publicaciones.map(pub => (
        <div key={pub.id} className={`publicacion-card ${pub.estado}`}>
          <h3>{pub.titulo}</h3>
          <p>{pub.descripcion}</p>
          
          <div className="info">
            <span>Estado: <strong>{pub.estado}</strong></span>
            <span>Despacho: {pub.despacho}</span>
            {pub.precio_envio && <span>Envío: ${pub.precio_envio}</span>}
          </div>
          
          {/* Mostrar moderación si fue rechazada */}
          {pub.estado === 'rechazado' && pub.moderaciones && (
            <div className="moderacion-warning">
              <strong>⚠️ Rechazada:</strong> {pub.moderaciones[0].motivo}
              {pub.moderaciones[0].palabras_detectadas.length > 0 && (
                <div>
                  Palabras: {pub.moderaciones[0].palabras_detectadas.join(', ')}
                </div>
              )}
            </div>
          )}
          
          <div className="acciones">
            {pub.estado === 'activo' && (
              <>
                <button onClick={() => cambiarEstado(pub.id, 'pausado')}>
                  Pausar
                </button>
                <button onClick={() => cambiarEstado(pub.id, 'vendido')}>
                  Marcar como Vendido
                </button>
              </>
            )}
            {pub.estado === 'pausado' && (
              <button onClick={() => cambiarEstado(pub.id, 'activo')}>
                Reactivar
              </button>
            )}
            <button onClick={() => eliminarPublicacion(pub.id)}>
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PublicacionesList;
```

---

## 📊 Estados de Publicación

| Estado | Descripción | Acciones Frontend |
|--------|-------------|-------------------|
| `borrador` | Publicación guardada sin publicar | Editar, Publicar, Eliminar |
| `en_revision` | Pendiente de moderación | Ver, Esperar |
| `activo` | Publicación visible para compradores | Pausar, Marcar vendido, Editar, Eliminar |
| `pausado` | Temporalmente no visible | Reactivar, Eliminar |
| `vendido` | Producto vendido | Ver historial |
| `rechazado` | Bloqueada por moderación | Ver motivo, Editar y republicar |
| `eliminado` | Soft delete | Restaurar (admin) |

---

## 🔴 Manejo de Errores

```typescript
try {
  const response = await axios.post('/api/publicaciones', data);
  // Éxito
} catch (error) {
  if (error.response) {
    // El servidor respondió con un código de error
    switch (error.response.status) {
      case 400:
        // Bad Request - Validación fallida
        console.error('Datos inválidos:', error.response.data.message);
        break;
      case 404:
        // Not Found
        console.error('Publicación no encontrada');
        break;
      case 500:
        // Server Error
        console.error('Error del servidor');
        break;
    }
  } else {
    // Error de red
    console.error('Error de conexión');
  }
}
```

---

## 🔧 Configuración de Axios (Recomendada)

**`src/services/api.ts`:**
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para agregar token (si usas autenticación)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**Uso:**
```typescript
import api from './services/api';

const crearPublicacion = async (datos) => {
  const response = await api.post('/publicaciones', datos);
  return response.data;
};
```

---

## 📝 TypeScript Interfaces (Copiar a tu proyecto)

```typescript
// types/publicacion.ts

export interface CreatePublicacionDto {
  id_vendedor: string;
  id_producto: string;
  titulo: string;
  descripcion: string;
  despacho?: 'retiro_en_tienda' | 'envio' | 'ambos';
  precio_envio?: number;
  estado?: EstadoPublicacion;
  multimedia?: MultimediaDto[];
}

export interface MultimediaDto {
  url: string;
  orden: number;
  tipo?: 'imagen' | 'video';
}

export type EstadoPublicacion = 
  | 'borrador' 
  | 'en_revision' 
  | 'activo' 
  | 'pausado' 
  | 'vendido' 
  | 'rechazado' 
  | 'eliminado';

export interface Publicacion {
  id: string;
  id_vendedor: string;
  id_producto: string;
  titulo: string;
  descripcion: string;
  despacho: string;
  precio_envio: number | null;
  estado: EstadoPublicacion;
  fecha_creacion: string;
  fecha_modificacion: string;
  multimedia: Multimedia[];
  moderaciones?: Moderacion[];
}

export interface Multimedia {
  id: string;
  id_publicacion: string;
  url: string;
  cloudinary_public_id: string | null;
  orden: number;
  tipo: string;
}

export interface Moderacion {
  id: string;
  id_publicacion: string;
  id_moderador: string | null;
  tipo_moderacion: 'automatica' | 'manual';
  accion: 'aprobado' | 'rechazado';
  motivo: string;
  palabras_detectadas: string[];
  contenido_detectado: string[];
  fecha: string;
}
```

---

## ⚠️ Validaciones Frontend (Antes de Enviar)

```typescript
const validarPublicacion = (datos: CreatePublicacionDto): string[] => {
  const errores: string[] = [];
  
  if (!datos.titulo || datos.titulo.length < 5) {
    errores.push('El título debe tener al menos 5 caracteres');
  }
  
  if (datos.titulo && datos.titulo.length > 100) {
    errores.push('El título no puede superar los 100 caracteres');
  }
  
  if (!datos.descripcion || datos.descripcion.length < 10) {
    errores.push('La descripción debe tener al menos 10 caracteres');
  }
  
  if (datos.descripcion && datos.descripcion.length > 1000) {
    errores.push('La descripción no puede superar los 1000 caracteres');
  }
  
  if (!datos.id_vendedor) {
    errores.push('ID de vendedor es requerido');
  }
  
  if (!datos.id_producto) {
    errores.push('ID de producto es requerido');
  }
  
  if (datos.precio_envio && datos.precio_envio < 0) {
    errores.push('El precio de envío no puede ser negativo');
  }
  
  return errores;
};

// Uso
const errores = validarPublicacion(formData);
if (errores.length > 0) {
  alert(errores.join('\n'));
  return;
}
```

---

## 🎯 Checklist de Integración

- [ ] Configurar axios con baseURL
- [ ] Crear interfaces TypeScript
- [ ] Implementar servicio de API
- [ ] Crear formulario de publicación
- [ ] Validar campos antes de enviar
- [ ] Manejar respuesta de moderación
- [ ] Mostrar palabras detectadas si es rechazada
- [ ] Implementar listado de publicaciones
- [ ] Agregar filtros por estado
- [ ] Implementar cambio de estado
- [ ] Manejar errores de red
- [ ] Agregar loading states
- [ ] Testear con palabras prohibidas
- [ ] Implementar paginación (si aplica)

---

## 🔗 Links Útiles

- **Backend:** http://localhost:3000/api
- **Documentación Completa:** Ver `API_ENDPOINTS.md`
- **Diccionario de Datos:** Ver `DICCIONARIO_DATOS.md`
- **Ejemplos de API:** Ver `EJEMPLOS_API.md`
- **Sistema de Moderación:** Ver `MODERACION_README.md`

---

## 📞 Soporte

Si tienes dudas sobre la integración, contacta al equipo de backend.

**Documento generado:** 11/11/2025  
**Última actualización:** 17:20 hrs
