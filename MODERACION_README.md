# Sistema de Moderación Automática

## Descripción

El sistema de moderación automática analiza las publicaciones en el momento de su creación para detectar contenido inapropiado. La moderación se realiza en dos niveles:

1. **Análisis de texto**: Detecta palabras indebidas en español chileno
2. **Análisis de imágenes**: Detecta contenido sexual, armas, drogas y violencia (requiere integración con API externa)

## Flujo de Moderación

```
1. Usuario crea publicación
   ↓
2. Publicación se guarda con estado "en_revision"
   ↓
3. Sistema ejecuta moderación automática
   ↓
4. Se analiza título y descripción
   ↓
5. Se genera registro de moderación
   ↓
6. Estado se actualiza a "activo" o "rechazado"
```

## Palabras Detectadas

El sistema detecta automáticamente:

### Palabras Ofensivas
- Groserías y términos despectivos en español chileno
- Insultos y lenguaje ofensivo

### Términos Relacionados con Drogas
- Nombres de drogas y sustancias ilícitas
- Jerga relacionada con el consumo y venta

### Términos Relacionados con Armas
- Tipos de armas de fuego
- Municiones y explosivos

### Contenido Sexual Explícito
- Términos pornográficos
- Referencias a explotación sexual

### Actividades Ilícitas
- Estafas y fraudes
- Productos robados o falsificados

## Moderación de Imágenes

Para implementar la moderación de imágenes en producción, se recomienda integrar:

### Google Cloud Vision API
```javascript
// Ejemplo de integración
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

const [result] = await client.safeSearchDetection(imageUrl);
const detections = result.safeSearchAnnotation;
```

### AWS Rekognition
```javascript
// Ejemplo de integración
const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();

const params = {
  Image: { S3Object: { Bucket: 'bucket', Name: 'image.jpg' } }
};
await rekognition.detectModerationLabels(params).promise();
```

## Endpoints

### POST /api/publicaciones
Crea una publicación y ejecuta moderación automática
```json
{
  "id_vendedor": "123",
  "titulo": "Laptop usada",
  "descripcion": "Vendo laptop en buen estado",
  "precio": 350000,
  "despacho": "envio",
  "precio_envio": 5000
}
```

### POST /api/publicaciones/:id/moderacion
Moderación manual por un administrador
```json
{
  "id_moderador": "admin123",
  "accion": "rechazado",
  "motivo": "Publicación no cumple con los términos de servicio"
}
```

### GET /api/publicaciones/:id/moderacion
Obtiene el historial de moderaciones de una publicación

## Modelo de Datos

```prisma
model moderacion {
  id                  String   @id
  id_publicacion      String
  id_moderador        String?  // null si es automática
  tipo_moderacion     String   // "automatica" | "manual"
  accion              String   // "aprobado" | "rechazado"
  motivo              String
  palabras_detectadas String[] 
  contenido_detectado String[]
  fecha               DateTime
}
```

## Estados de Publicación

- `borrador`: Publicación guardada pero no enviada
- `en_revision`: En proceso de moderación
- `activo`: Aprobada y visible
- `rechazado`: Rechazada por contenido inapropiado
- `pausado`: Pausada temporalmente por el vendedor
- `vendido`: Artículo vendido
- `eliminado`: Eliminada por el usuario

## Personalización

Para agregar más palabras al filtro, edita el array `palabrasIndebidas` en:
```
src/moderacion/moderacion.service.ts
```

## Notas Importantes

1. La moderación automática se ejecuta de forma asíncrona
2. Las publicaciones inician en estado "en_revision"
3. Solo se cambian a "activo" o "rechazado" después de la moderación
4. Los administradores pueden realizar moderación manual
5. El historial de todas las moderaciones se mantiene en la base de datos

## Mejoras Futuras

- [ ] Integración con API de análisis de imágenes
- [ ] Machine Learning para detectar patrones de estafa
- [ ] Sistema de reputación de usuarios
- [ ] Alertas automáticas a administradores
- [ ] Dashboard de moderación
- [ ] Estadísticas de moderación
