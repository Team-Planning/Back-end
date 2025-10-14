import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriasModule } from './categorias/categorias.module';

@Module({
  imports: [
    // Carga y valida las variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // Disponible en toda la aplicación
    }),
    
    // Prisma Module (Global)
    PrismaModule,
    
    // Módulos de la aplicación
    // AuthModule,  // Comentado - No es responsabilidad de este microservicio
    // UsersModule, // Comentado - No es responsabilidad de este microservicio
    PublicacionesModule,
    CategoriasModule,
  ],
})
export class AppModule {}

