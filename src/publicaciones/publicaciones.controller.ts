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
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(@Body() dto: CreatePublicacionDto) {
    return this.publicacionesService.crear(dto);
  }

  @Get()
  async listarTodas() {
    return this.publicacionesService.listarTodas();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    return this.publicacionesService.obtenerPorId(id);
  }

  @Put(':id')
  async actualizar(@Param('id') id: string, @Body() dto: UpdatePublicacionDto) {
    return this.publicacionesService.actualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async eliminar(@Param('id') id: string) {
    return this.publicacionesService.eliminar(id);
  }

  @Delete('eliminar/:id')
  @HttpCode(HttpStatus.OK)
  async eliminarForzado(@Param('id') id: string) {
    return this.publicacionesService.eliminarForzado(id);
  }

  @Patch(':id/estado')
  async cambiarEstado(
    @Param('id') id: string,
    @Body() body: { estado: string }
  ) {
    return this.publicacionesService.cambiarEstado(id, body.estado);
  }

  // Endpoints para gestión de multimedia
  @Post(':id/multimedia')
  @HttpCode(HttpStatus.CREATED)
  async agregarMultimedia(
    @Param('id') id: string,
    @Body() body: { url: string; orden: number; tipo?: string }
  ) {
    return this.publicacionesService.agregarMultimedia(id, body);
  }

  @Delete('multimedia/:multimediaId')
  @HttpCode(HttpStatus.OK)
  async eliminarMultimedia(@Param('multimediaId') multimediaId: string) {
    return this.publicacionesService.eliminarMultimedia(multimediaId);
  }

  // Endpoint para agregar moderación
  @Post(':id/moderacion')
  @HttpCode(HttpStatus.CREATED)
  async agregarModeracion(
    @Param('id') id: string,
    @Body() body: { id_moderador?: string; accion: string; comentario: string }
  ) {
    return this.publicacionesService.agregarModeracion(id, body);
  }
}
