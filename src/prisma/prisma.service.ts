import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Conexión a MongoDB establecida correctamente');
    } catch (error) {
      this.logger.error('❌ Error al conectar con MongoDB:', error.message);
      this.logger.warn('Verifica tu conexión a internet y configuración de firewall');
      // No lanzamos el error para que la aplicación pueda iniciar
      // pero los endpoints fallarán con errores más descriptivos
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
