import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { PublicacionesController } from './publicaciones.controller';
import { PublicacionesService } from './publicaciones.service';
import { ModeracionModule } from '../moderacion/moderacion.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule, 
    ModeracionModule, 
    HttpModule
  ],
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
  exports: [PublicacionesService],
})
export class PublicacionesModule {}