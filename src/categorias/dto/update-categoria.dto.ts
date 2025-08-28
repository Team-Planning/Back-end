import {
  IsString,
  IsOptional,
  MaxLength
} from 'class-validator';

export class UpdateCategoriaDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;
}
