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
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Controller('Categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  async crear(@Body() dto: CreateCategoriaDto) {
    return this.categoriasService.crear(dto);
  }

  @Get()
  async listarTodas() {
    return this.categoriasService.listarTodas();
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
  async eliminar(@Param('id') id: string) {
    return this.categoriasService.eliminar(id);
  }
}
