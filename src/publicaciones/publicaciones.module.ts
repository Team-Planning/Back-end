import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { PublicacionesController } from './publicaciones.controller';
import { PublicacionesService } from './publicaciones.service';
import { CleanupService } from './cleanup.service';
import { ModeracionModule } from '../moderacion/moderacion.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    PrismaModule, 
    ModeracionModule, 
    HttpModule,
    CloudinaryModule
  ],
  controllers: [PublicacionesController],
  providers: [PublicacionesService, CleanupService],
  exports: [PublicacionesService],
})
export class PublicacionesModule {}