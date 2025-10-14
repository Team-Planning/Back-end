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
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(@Body() dto: CreateCategoriaDto) {
    return this.categoriasService.crear(dto);
  }

  @Get()
  async listarTodas() {
    return this.categoriasService.listarTodas();
  }

  @Get('activas')
  async listarActivas() {
    return this.categoriasService.listarActivas();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    return this.categoriasService.obtenerPorId(id);
  }

  @Put(':id')
  async actualizar(@Param('id') id: string, @Body() dto: UpdateCategoriaDto) {
    return this.categoriasService.actualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async eliminar(@Param('id') id: string) {
    return this.categoriasService.eliminar(id);
  }

  @Patch(':id/activar')
  async activar(@Param('id') id: string) {
    return this.categoriasService.activarDesactivar(id, true);
  }

  @Patch(':id/desactivar')
  async desactivar(@Param('id') id: string) {
    return this.categoriasService.activarDesactivar(id, false);
  }
}
