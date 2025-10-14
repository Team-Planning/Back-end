import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
<<<<<<< HEAD
  Patch,
  HttpCode,
  HttpStatus,
=======
  Patch
>>>>>>> 087c206160ac6d8e3482efcdbc4f7b9a2ea473fa
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

<<<<<<< HEAD
@Controller('categorias')
=======
@Controller('Categorias')
>>>>>>> 087c206160ac6d8e3482efcdbc4f7b9a2ea473fa
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
<<<<<<< HEAD
  @HttpCode(HttpStatus.CREATED)
=======
>>>>>>> 087c206160ac6d8e3482efcdbc4f7b9a2ea473fa
  async crear(@Body() dto: CreateCategoriaDto) {
    return this.categoriasService.crear(dto);
  }

  @Get()
  async listarTodas() {
    return this.categoriasService.listarTodas();
  }

<<<<<<< HEAD
  @Get('activas')
  async listarActivas() {
    return this.categoriasService.listarActivas();
  }

=======
>>>>>>> 087c206160ac6d8e3482efcdbc4f7b9a2ea473fa
  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    return this.categoriasService.obtenerPorId(id);
  }

  @Put(':id')
  async actualizar(@Param('id') id: string, @Body() dto: UpdateCategoriaDto) {
    return this.categoriasService.actualizar(id, dto);
  }

  @Delete(':id')
<<<<<<< HEAD
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
=======
  async eliminar(@Param('id') id: string) {
    return this.categoriasService.eliminar(id);
  }
>>>>>>> 087c206160ac6d8e3482efcdbc4f7b9a2ea473fa
}
