import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Tarea programada que se ejecuta todos los días a las 2:00 AM
   * Elimina permanentemente las publicaciones que llevan más de 30 días eliminadas
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async limpiarPublicacionesEliminadas() {
    this.logger.log('🧹 Iniciando limpieza de publicaciones eliminadas...');

    try {
      // Calcular fecha de hace 30 días
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - 30);

      // Buscar publicaciones eliminadas hace más de 30 días
      const publicacionesAEliminar = await this.prisma.publicacion.findMany({
        where: {
          estado: 'eliminado',
          fecha_eliminacion: {
            lte: fechaLimite, // Menor o igual a la fecha límite
          },
        },
        include: {
          multimedia: true,
        },
      });

      if (publicacionesAEliminar.length === 0) {
        this.logger.log('✅ No hay publicaciones para limpiar');
        return;
      }

      this.logger.log(`📦 Encontradas ${publicacionesAEliminar.length} publicaciones para eliminar permanentemente`);

      // Eliminar cada publicación
      for (const publicacion of publicacionesAEliminar) {
        try {
          // Recopilar IDs de Cloudinary
          const imagenesConPublicId = publicacion.multimedia
            .filter(m => m.cloudinary_public_id)
            .map(m => m.cloudinary_public_id!);

          // Eliminar imágenes de Cloudinary
          if (imagenesConPublicId.length > 0) {
            const result = await this.cloudinaryService.deleteMultipleImages(imagenesConPublicId);
            this.logger.log(`🗑️  Publicación ${publicacion.id}: ${result.deleted.length} imágenes eliminadas de Cloudinary`);
            
            if (result.errors.length > 0) {
              this.logger.warn(`⚠️  Publicación ${publicacion.id}: Errores al eliminar algunas imágenes: ${result.errors.join(', ')}`);
            }
          }

          // Eliminar publicación de la base de datos (cascade eliminará multimedia y moderaciones)
          await this.prisma.publicacion.delete({
            where: { id: publicacion.id },
          });

          this.logger.log(`✅ Publicación ${publicacion.id} eliminada permanentemente`);
        } catch (error) {
          this.logger.error(`❌ Error al eliminar publicación ${publicacion.id}: ${error.message}`);
        }
      }

      this.logger.log(`🎉 Limpieza completada: ${publicacionesAEliminar.length} publicaciones eliminadas permanentemente`);
    } catch (error) {
      this.logger.error(`❌ Error en limpieza de publicaciones: ${error.message}`);
    }
  }

  /**
   * Método manual para ejecutar la limpieza (útil para pruebas o ejecución manual)
   */
  async ejecutarLimpiezaManual() {
    this.logger.log('🔧 Ejecutando limpieza manual...');
    await this.limpiarPublicacionesEliminadas();
  }
}
