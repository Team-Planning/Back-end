import {
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
  IsMongoId
} from 'class-validator';

export class UpdatePublicacionDto {
  @IsOptional()
  @IsString()
  id_vendedor?: string;

  @IsOptional()
  @IsString()
  id_producto?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  titulo?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  descripcion?: string;

  @IsOptional()
  @IsMongoId()
  categoriaId?: string;

  @IsOptional()
  @IsString()
  estado?: string;
}
