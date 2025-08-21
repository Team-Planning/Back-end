import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Patch
} from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
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
  async eliminar(@Param('id') id: string) {
    return this.publicacionesService.eliminar(id);
  }

  @Patch(':id/estado')
  async cambiarEstado(
    @Param('id') id: string,
    @Body() body: { estado: string }
  ) {
    return this.publicacionesService.cambiarEstado(id, body.estado);
  }
}
