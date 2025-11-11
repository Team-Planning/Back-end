import { Module } from '@nestjs/common';
import { ModeracionService } from './moderacion.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ModeracionService],
  exports: [ModeracionService],
})
export class ModeracionModule {}
