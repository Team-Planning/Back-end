import {
  IsString,
  IsNotEmpty,
  MaxLength
} from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  descripcion: string;
}
