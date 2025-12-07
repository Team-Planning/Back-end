import {
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
  IsIn,
  IsNumber
} from 'class-validator';

export class UpdatePublicacionDto {
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
  @IsString()
  @IsIn([
    'borrador',
    'en_revision',
    'activo',
    'pausado',
    'vendido',
    'rechazado',
    'eliminado'
  ])
  estado?: string;

  @IsOptional()
  @IsNumber()
  precio?: number;
}
