import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { PrismaModule } from './prisma/prisma.module';
import { ModeracionModule } from './moderacion/moderacion.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    // Carga y valida las variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // Disponible en toda la aplicación
    }),
    
    // Prisma Module (Global)
    PrismaModule,
    
    // Cloudinary Module (Global para upload de imágenes)
    CloudinaryModule,
    
    // Módulos de la aplicación
    // AuthModule,  // Comentado - No es responsabilidad de este microservicio
    // UsersModule, // Comentado - No es responsabilidad de este microservicio
    PublicacionesModule,
    ModeracionModule,
  ],
})
export class AppModule {}

