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
} from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionDto, MultimediaDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { ModeracionManualDto } from './dto/moderacion-manual.dto';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

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

  @Post(':id/moderacion')
  @HttpCode(HttpStatus.CREATED)
  async agregarModeracion(
    @Param('id') id: string,
    @Body() body: ModeracionManualDto
  ) {
    return this.publicacionesService.agregarModeracionManual(
      id,
      body.id_moderador,
      body.accion,
      body.motivo,
    );
  }

  @Get()
  async listarTodas() {
    return this.publicacionesService.listarTodas();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    return this.publicacionesService.obtenerPorId(id);
  }

  @Get(':id/moderacion')
  async obtenerHistorialModeracion(@Param('id') id: string) {
    return this.publicacionesService.obtenerHistorialModeracion(id);
  }

  @Put(':id')
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
}
