import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModeracionService {
  constructor(private readonly prisma: PrismaService) {}

  // Lista de palabras indebidas en español chileno
  private readonly palabrasIndebidas = [
  // Palabras ofensivas generales
  'puta', 'puto', 'ctm', 'conchetumare', 'concha', 'maricon', 'marica',
  'weon', 'weón', 'culiao', 'culiado', 'aweonao', 'aweonado',
  'huevon', 'huevón', 'mierda', 'caca', 'poto', 'pico', 'pichula',
  'tula', 'verga', 'pene', 'zorra', 'prostituta', 'trolo', 'roto', 'flaite',

  // Drogas
  'droga', 'drogas', 'cocaina', 'coca', 'marihuana', 'maria', 'mota',
  'hierba', 'pasta', 'pbc', 'extasis', 'lsd', 'anfetamina', 'farlopa',
  'farlar', 'jale', 'jalar', 'pase', 'perico', 'blanca', 'nieve',
  'cripi', 'cripy', 'tusi', 'mdma', 'hachis', 'porro', 'opio',
  'ketamina',

  // Armas
  'pistola', 'revolver', 'fusil', 'rifle', 'escopeta', 'arma',
  'arma blanca', 'bala', 'balas', 'municion', 'granada', 'explosivo',
  'dinamita', 'metralleta', 'subfusil', 'cuchillo tactico',
  'navaja automatica', 'silenciador', 'detonador',

  // Contenido sexual indebido para publicaciones
  'sexo', 'porno', 'pornografia', 'xxx', 'escort',
  'contenido adulto', 'servicio adulto', 'acompanante para adultos',
  'prostitucion', 'trata', 'explotacion',

  // Delitos / estafas / fraude
  'estafa', 'scam', 'fraude', 'estafador', 'fraudulento',
  'robo', 'robado', 'choreo', 'robao', 'mercancia robada',
  'pirata', 'falsificado', 'replica ilegal',
  'clon', 'clonado', 'tarjeta clonada', 'phishing',
  'software crackeado', 'crack', 'keygen', 'fake',
  'hackear', 'hackeo', 'accedo a cuentas',
  'cuentas robadas', 'desbloqueo ilegal', 'bypass',

  // Documentos falsos y servicios ilegales
  'carnet falso', 'licencia falsa', 'pasaporte falso',
  'certificado falso', 'documento falsificado',
  'boleta falsa', 'factura falsa',

  // Contenido violento o de riesgo
  'pelea organizada', 'riña', 'amenaza', 'violencia',
  'agredir', 'dañar', 'ataque'
];

  // Normaliza un texto para facilitar la detección de palabras indebidas
  private normalizar(texto: string): string {
    return texto
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, '') // quita tildes
      .replace(/[^a-z0-9]/g, '') // elimina símbolos
      .replace(/4/g, 'a')
      .replace(/3/g, 'e')
      .replace(/1/g, 'i')
      .replace(/0/g, 'o')
      .replace(/v/g, 'u')
      .replace(/k/g, 'c');
  }

  private distancia(a: string, b: string): number {
    const dp = Array(a.length + 1).fill(null).map(() =>
      Array(b.length + 1).fill(null)
    );

    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const costo = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + costo
        );
      }
    }
    return dp[a.length][b.length];
  }

  private esSimilar(texto: string, palabra: string): boolean {
    // tolerancia adaptativa
    const maxDist = palabra.length <= 5 ? 1 : 2;
    return this.distancia(texto, palabra) <= maxDist;
  }

  private detectarPalabras(texto: string): string[] {
    const textoNorm = this.normalizar(texto);
    const detectadas = new Set<string>();

    for (const palabra of this.palabrasIndebidas) {
      const baseNorm = this.normalizar(palabra);

      // detección exacta por inclusión
      if (textoNorm.includes(baseNorm)) {
        detectadas.add(palabra);
        continue;
      }

      // detección por similitud
      for (let i = 0; i < textoNorm.length - baseNorm.length + 1; i++) {
        const segmento = textoNorm.substring(i, i + baseNorm.length);
        if (this.esSimilar(segmento, baseNorm)) {
          detectadas.add(palabra);
          break;
        }
      }
    }

    return [...detectadas];
  }

  // Modera automáticamente una publicación al crearla
  async moderarPublicacion(publicacionId: string, titulo: string, descripcion: string): Promise<any> {
    const contenidoDetectado: string[] = [];
    const textoCompleto = `${titulo} ${descripcion}`;

    const palabrasEncontradas = this.detectarPalabras(textoCompleto);

    // Determinar si la publicación debe ser rechazada
    const rechazar = palabrasEncontradas.length > 0;
    const accion = rechazar ? 'rechazado' : 'aprobado';

    const motivo = rechazar
      ? `Contenido inapropiado detectado. Palabras prohibidas encontradas: ${palabrasEncontradas.join(', ')}`
      : 'Publicación aprobada automáticamente.';

    // Crear registro de moderación
    const moderacion = await this.prisma.moderacion.create({
      data: {
        id_publicacion: publicacionId,
        tipo_moderacion: 'automatica',
        accion,
        motivo,
        palabras_detectadas: palabrasEncontradas,
        contenido_detectado: contenidoDetectado,
      }
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

  async moderarImagen(publicacionId: string, imagenUrl: string): Promise<any> {
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
  ) {
    const moderacion = await this.prisma.moderacion.create({
      data: {
        id_publicacion: publicacionId,
        id_moderador: idModerador,
        tipo_moderacion: 'manual',
        accion,
        motivo,
        palabras_detectadas: [],
        contenido_detectado: [],
      }
    });

    await this.prisma.publicacion.update({
      where: { id: publicacionId },
      data: { estado: accion === 'aprobado' ? 'activo' : 'rechazado' }
    });

    return moderacion;
  }

  async obtenerHistorialModeracion(publicacionId: string): Promise<any[]> {
    return this.prisma.moderacion.findMany({
      where: { id_publicacion: publicacionId },
      orderBy: { fecha: 'desc' },
    });
  }

  verificarTexto(texto: string) {
    const palabrasEncontradas = this.detectarPalabras(texto);
    return {
      limpio: palabrasEncontradas.length === 0,
      palabrasEncontradas,
    };
  }
}
