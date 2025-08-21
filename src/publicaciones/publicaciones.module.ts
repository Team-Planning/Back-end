import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicacionesController } from './publicaciones.controller';
import { PublicacionesService } from './publicaciones.service';

import { PublicacionSchema } from './schemas/publicacion.schema';
import { CategoriaSchema } from './schemas/categoria.schema';
import { ImagenSchema } from './schemas/imagen.schema';
import { ModeracionSchema } from './schemas/moderacion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Publicacion', schema: PublicacionSchema },
      { name: 'Categoria', schema: CategoriaSchema },
      { name: 'Imagen', schema: ImagenSchema },
      { name: 'Moderacion', schema: ModeracionSchema }
    ])
  ],
  controllers: [PublicacionesController],
  providers: [PublicacionesService]
})
export class PublicacionesModule {}
