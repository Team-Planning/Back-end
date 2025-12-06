import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModeracionService {
  private readonly logger = new Logger(ModeracionService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Palabras prohibidas organizadas por categoría
  private readonly palabrasProhibidas = {
    ofensivas: [
      'puta', 'puto', 'ctm', 'conchetumare', 'concha', 'maricon', 'marica',
      'weon', 'weon', 'culiao', 'culiado', 'aweonao', 'aweonado',
      'huevon', 'huevon', 'mierda', 'caca', 'poto', 'pico', 'pichula',
      'tula', 'verga', 'pene', 'zorra', 'prostituta', 'trolo', 'roto', 'flaite',
    ],
    drogas: [
      'droga', 'drogas', 'cocaina', 'coca', 'marihuana', 'maria', 'mota',
      'hierba', 'pasta', 'pbc', 'extasis', 'lsd', 'anfetamina', 'farlopa',
      'farlar', 'jale', 'jalar', 'pase', 'perico', 'blanca', 'nieve',
      'cripi', 'cripy', 'tusi', 'mdma', 'hachis', 'porro', 'opio', 'ketamina',
    ],
    armas: [
      'pistola', 'revolver', 'fusil', 'rifle', 'escopeta', 'arma',
      'arma blanca', 'bala', 'balas', 'municion', 'granada', 'explosivo',
      'dinamita', 'metralleta', 'subfusil', 'cuchillo tactico',
      'navaja automatica', 'silenciador', 'detonador',
    ],
    sexual: [
      'sexo', 'porno', 'pornografia', 'xxx', 'escort',
      'contenido adulto', 'servicio adulto', 'acompanante para adultos',
      'prostitucion', 'trata', 'explotacion',
    ],
    fraude: [
      'estafa', 'scam', 'fraude', 'estafador', 'fraudulento',
      'robo', 'robado', 'choreo', 'robao', 'mercancia robada',
      'pirata', 'falsificado', 'replica ilegal',
      'clon', 'clonado', 'tarjeta clonada', 'phishing',
      'software crackeado', 'crack', 'keygen', 'fake',
      'hackear', 'hackeo', 'accedo a cuentas',
      'cuentas robadas', 'desbloqueo ilegal', 'bypass',
    ],
    documentosFalsos: [
      'carnet falso', 'licencia falsa', 'pasaporte falso',
      'certificado falso', 'documento falsificado',
      'boleta falsa', 'factura falsa',
    ],
    violencia: [
      'pelea organizada', 'rina', 'amenaza', 'violencia',
      'agredir', 'danar', 'ataque',
    ],
  };

  // Protección contra falsos positivos comunes
  private readonly palabrasExcluidas = new Set([
    'kayak', 'poker', 'kilo', 'kilometro', 'kernel', 'marketing',
    'basket', 'token', 'ticket', 'whisky', 'kimchi'
  ]);

  private normalizar(texto: string): string {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/4/g, 'a')
      .replace(/3/g, 'e')
      .replace(/1/g, 'i')
      .replace(/0/g, 'o');
  }

  private distanciaLevenshtein(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matriz: number[][] = Array(a.length + 1)
      .fill(null)
      .map(() => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) matriz[i][0] = i;
    for (let j = 0; j <= b.length; j++) matriz[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const costo = a[i - 1] === b[j - 1] ? 0 : 1;
        matriz[i][j] = Math.min(
          matriz[i - 1][j] + 1,
          matriz[i][j - 1] + 1,
          matriz[i - 1][j - 1] + costo
        );
      }
    }

    return matriz[a.length][b.length];
  }

  private esSimilar(texto: string, palabra: string): boolean {
    const maxDist = palabra.length <= 4 ? 0 : palabra.length <= 6 ? 1 : 2;
    return this.distanciaLevenshtein(texto, palabra) <= maxDist;
  }

  private detectarPalabrasProhibidas(texto: string): {
    palabrasEncontradas: string[];
    categorias: string[];
  } {
    const textoNorm = this.normalizar(texto);
    const palabrasTexto = textoNorm.split(' ');
    
    const detectadas = new Map<string, string>();

    if (palabrasTexto.some(p => this.palabrasExcluidas.has(p))) {
    }

    for (const [categoria, listaPalabras] of Object.entries(this.palabrasProhibidas)) {
      for (const palabraProhibida of listaPalabras) {
        const palabraNorm = this.normalizar(palabraProhibida);
        
        // Solo buscar palabras completas, no subcadenas
        for (const palabraTexto of palabrasTexto) {
          // Coincidencia exacta
          if (palabraTexto === palabraNorm) {
            detectadas.set(palabraProhibida, categoria);
            break;
          }

          // Coincidencia difusa solo para palabras largas (>= 5 caracteres)
          // y con longitud similar
          if (palabraProhibida.length >= 5) {
            if (Math.abs(palabraTexto.length - palabraNorm.length) <= 2) {
              if (this.esSimilar(palabraTexto, palabraNorm)) {
                detectadas.set(palabraProhibida, categoria);
                break;
              }
            }
          }
        }
      }
    }

    const categorias = [...new Set(detectadas.values())];
    const palabrasEncontradas = [...detectadas.keys()];

    return { palabrasEncontradas, categorias };
  }

  async moderarPublicacion(
    publicacionId: string,
    titulo: string,
    descripcion: string
  ): Promise<any> {
    try {
      const textoCompleto = `${titulo} ${descripcion}`;
      const { palabrasEncontradas, categorias } = this.detectarPalabrasProhibidas(textoCompleto);

      const rechazar = palabrasEncontradas.length > 0;
      const accion = rechazar ? 'rechazado' : 'aprobado';

      const motivo = rechazar
        ? `Contenido inapropiado detectado. Categorías: ${categorias.join(', ')}. ` +
          `Palabras: ${palabrasEncontradas.slice(0, 5).join(', ')}` +
          (palabrasEncontradas.length > 5 ? ` (+${palabrasEncontradas.length - 5} más)` : '')
        : 'Publicación aprobada automáticamente.';

      const resultado = await this.prisma.$transaction(async (tx) => {
        const moderacion = await tx.moderacion.create({
          data: {
            id_publicacion: publicacionId,
            tipo_moderacion: 'automatica',
            accion,
            motivo,
            palabras_detectadas: palabrasEncontradas,
            contenido_detectado: categorias,
          },
        });

        await tx.publicacion.update({
          where: { id: publicacionId },
          data: {
            estado: rechazar ? 'rechazado' : 'activo',
          },
        });

        return moderacion;
      });

      if (rechazar) {
        this.logger.warn(
          `Publicación ${publicacionId} rechazada: ${palabrasEncontradas.length} palabras prohibidas encontradas`
        );
      } else {
        this.logger.log(`Publicación ${publicacionId} aprobada automáticamente`);
      }

      return resultado;

    } catch (error) {
      this.logger.error(
        `Error al moderar publicación ${publicacionId}:`,
        error.stack
      );
      throw new Error('Error al procesar la moderación de la publicación');
    }
  }

  async obtenerHistorialModeracion(publicacionId: string): Promise<any[]> {
    try {
      return await this.prisma.moderacion.findMany({
        where: { id_publicacion: publicacionId },
        orderBy: { fecha: 'desc' },
      });
    } catch (error) {
      this.logger.error(
        `Error al obtener historial de moderación para ${publicacionId}:`,
        error.stack
      );
      throw new Error('Error al obtener el historial de moderación');
    }
  }

  verificarTexto(texto: string): {
    limpio: boolean;
    palabrasEncontradas: string[];
    categorias: string[];
  } {
    const { palabrasEncontradas, categorias } = this.detectarPalabrasProhibidas(texto);
    
    return {
      limpio: palabrasEncontradas.length === 0,
      palabrasEncontradas,
      categorias,
    };
  }
}