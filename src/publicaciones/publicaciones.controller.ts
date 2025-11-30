import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Patch,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CleanupService } from './cleanup.service';
import { CreatePublicacionDto, MultimediaDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(
    private readonly publicacionesService: PublicacionesService,
    private readonly cleanupService: CleanupService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(@Body() dto: CreatePublicacionDto) {
    return this.publicacionesService.crear(dto);
  }

  @Post(':id/multimedia')
  @HttpCode(HttpStatus.CREATED)
  async agregarMultimedia(
    @Param('id') id: string,
    @Body() body: MultimediaDto
  ) {
    return this.publicacionesService.agregarMultimedia(id, body);
  }

  @Get()
  async listarTodas(@Query('includeEliminadas') includeEliminadas?: string) {
    const incluir = includeEliminadas === 'true';
    return this.publicacionesService.listarTodas(incluir);
  }

  @Get('tienda/:id_tienda')
  async obtenerPorTienda(@Param('id_tienda') id_tienda: string) {
    return this.publicacionesService.obtenerPorTienda(+id_tienda);
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    return this.publicacionesService.obtenerPorId(id);
  }

  @Get(':id/moderacion')
  async obtenerHistorialModeracion(@Param('id') id: string) {
    return this.publicacionesService.obtenerHistorialModeracion(id);
  }

  @Patch(':id')
  async actualizar(@Param('id') id: string, @Body() dto: UpdatePublicacionDto) {
    return this.publicacionesService.actualizar(id, dto);
  }

  @Patch(':id/estado')
  async cambiarEstado(
    @Param('id') id: string,
    @Body('estado') estado: 'borrador' | 'en_revision' | 'activo' | 'pausado' | 'vendido' | 'rechazado' | 'eliminado'
  ) {
    return this.publicacionesService.cambiarEstado(id, estado);
  }

  @Delete('multimedia/:multimediaId')
    @HttpCode(HttpStatus.OK)
    async eliminarMultimedia(@Param('multimediaId') multimediaId: string) {
      return this.publicacionesService.eliminarMultimedia(multimediaId);
    }

  @Delete('eliminar/:id')
  @HttpCode(HttpStatus.OK)
  async eliminarForzado(@Param('id') id: string) {
    return this.publicacionesService.eliminarForzado(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async eliminar(@Param('id') id: string) {
    return this.publicacionesService.eliminar(id);
  }

  @Post('cleanup/ejecutar')
  @HttpCode(HttpStatus.OK)
  async ejecutarLimpiezaManual() {
    await this.cleanupService.ejecutarLimpiezaManual();
    return { mensaje: 'Limpieza ejecutada correctamente' };
  }
}
