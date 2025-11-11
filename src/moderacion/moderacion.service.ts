import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModeracionService {
  constructor(private readonly prisma: PrismaService) {}

  // Lista de palabras indebidas en español chileno
  private readonly palabrasIndebidas = [
    // Palabras ofensivas generales
    'puta', 'puto', 'ctm', 'conchetumare', 'concha', 'maricon', 'marica',
    'weon', 'weón', 'culiao', 'culiado', 'aweonao', 'aweonado', 'huevon', 'huevón',
    'mierda', 'caca', 'poto', 'pico', 'pichula', 'tula', 'verga', 'pene',
    'concha', 'zorra', 'prostituta', 'trolo', 'roto', 'flaite',
    
    // Términos relacionados con drogas
    'droga', 'cocaina', 'coca', 'marihuana', 'maria', 'mota', 'hierba',
    'pasta', 'pbc', 'extasis', 'lsd', 'anfetamina', 'farlopa', 'farlar',
    'jale', 'jalar', 'pase', 'perico', 'blanca', 'nieve', 'cripi', 'cripy',
    
    // Términos relacionados con armas
    'pistola', 'revolver', 'fusil', 'rifle', 'escopeta', 'arma', 'bala', 'municion',
    'granada', 'explosivo', 'dinamita', 'metralleta', 'subfusil',
    
    // Términos sexuales explícitos
    'sexo', 'porno', 'pornografia', 'xxx', 'escort', 'prostitución',
    'trata', 'menor', 'pedofilia', 'violacion', 'acoso',
    
    // Términos de estafa o fraude
    'estafa', 'robo', 'robado', 'choreo', 'robao', 'pirata', 'falsificado',
    'clon', 'clonado', 'hackear', 'hackeo'
  ];

  // Categorías de contenido prohibido para detección en imágenes
  private readonly categoriasProhibidas = {
    sexual: ['nudity', 'sexual', 'porn', 'explicit'],
    armas: ['weapon', 'gun', 'knife', 'rifle', 'firearm'],
    drogas: ['drug', 'marijuana', 'cocaine', 'pills'],
    violencia: ['violence', 'blood', 'gore', 'fight']
  };

  /**
   * Modera automáticamente una publicación al crearla
   */
  async moderarPublicacion(publicacionId: string, titulo: string, descripcion: string): Promise<any> {
    const palabrasEncontradas: string[] = [];
    const contenidoDetectado: string[] = [];
    
    // Combinar título y descripción para análisis
    const textoCompleto = `${titulo} ${descripcion}`.toLowerCase();
    
    // Detectar palabras indebidas
    for (const palabra of this.palabrasIndebidas) {
      const regex = new RegExp(`\\b${palabra}\\b`, 'gi');
      if (regex.test(textoCompleto)) {
        palabrasEncontradas.push(palabra);
      }
    }

    // Determinar si la publicación debe ser rechazada
    const rechazar = palabrasEncontradas.length > 0;
    const accion = rechazar ? 'rechazado' : 'aprobado';
    
    let motivo = '';
    if (rechazar) {
      motivo = `Contenido inapropiado detectado. Palabras prohibidas encontradas: ${palabrasEncontradas.join(', ')}`;
    } else {
      motivo = 'Publicación aprobada automáticamente. No se detectaron problemas.';
    }

    // Crear registro de moderación
    const moderacion = await this.prisma.moderacion.create({
      data: {
        id_publicacion: publicacionId,
        tipo_moderacion: 'automatica',
        accion,
        motivo,
        palabras_detectadas: palabrasEncontradas,
        contenido_detectado: contenidoDetectado,
      },
    });

    // Actualizar el estado de la publicación
    await this.prisma.publicacion.update({
      where: { id: publicacionId },
      data: {
        estado: rechazar ? 'rechazado' : 'activo',
      },
    });

    return moderacion;
  }

  /**
   * Modera imágenes usando análisis de contenido
   * NOTA: Para producción, deberías integrar un servicio como:
   * - Google Cloud Vision API
   * - AWS Rekognition
   * - Azure Computer Vision
   * 
   * Por ahora, implementaremos una versión básica que simula la detección
   */
  async moderarImagen(publicacionId: string, imagenUrl: string): Promise<any> {
    // TODO: Implementar integración con servicio de análisis de imágenes
    // Por ahora retornamos un resultado simulado
    
    const contenidoDetectado: string[] = [];
    
    // Simulación: En producción aquí llamarías a un API de análisis de imágenes
    // Ejemplo con Google Vision API o AWS Rekognition
    
    const rechazar = contenidoDetectado.length > 0;
    
    if (rechazar) {
      const moderacion = await this.prisma.moderacion.create({
        data: {
          id_publicacion: publicacionId,
          tipo_moderacion: 'automatica',
          accion: 'rechazado',
          motivo: `Contenido inapropiado detectado en imagen: ${contenidoDetectado.join(', ')}`,
          palabras_detectadas: [],
          contenido_detectado: contenidoDetectado,
        },
      });

      // Actualizar estado de la publicación
      await this.prisma.publicacion.update({
        where: { id: publicacionId },
        data: { estado: 'rechazado' },
      });

      return moderacion;
    }

    return null;
  }

  /**
   * Moderación manual por un administrador
   */
  async moderacionManual(
    publicacionId: string,
    idModerador: string,
    accion: 'aprobado' | 'rechazado',
    motivo: string
  ): Promise<any> {
    const moderacion = await this.prisma.moderacion.create({
      data: {
        id_publicacion: publicacionId,
        id_moderador: idModerador,
        tipo_moderacion: 'manual',
        accion,
        motivo,
        palabras_detectadas: [],
        contenido_detectado: [],
      },
    });

    // Actualizar estado de la publicación
    await this.prisma.publicacion.update({
      where: { id: publicacionId },
      data: {
        estado: accion === 'aprobado' ? 'activo' : 'rechazado',
      },
    });

    return moderacion;
  }

  /**
   * Obtener historial de moderaciones de una publicación
   */
  async obtenerHistorialModeracion(publicacionId: string): Promise<any[]> {
    return this.prisma.moderacion.findMany({
      where: { id_publicacion: publicacionId },
      orderBy: { fecha: 'desc' },
    });
  }

  /**
   * Verificar si un texto contiene palabras indebidas
   */
  verificarTexto(texto: string): { limpio: boolean; palabrasEncontradas: string[] } {
    const palabrasEncontradas: string[] = [];
    const textoLower = texto.toLowerCase();
    
    for (const palabra of this.palabrasIndebidas) {
      const regex = new RegExp(`\\b${palabra}\\b`, 'gi');
      if (regex.test(textoLower)) {
        palabrasEncontradas.push(palabra);
      }
    }

    return {
      limpio: palabrasEncontradas.length === 0,
      palabrasEncontradas,
    };
  }
}
