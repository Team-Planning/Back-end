import {
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
  IsNumber,
  Min,
  IsIn
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
  @IsString()
  @IsIn(['retiro_en_tienda', 'envio', 'ambos'])
  despacho?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precio_envio?: number;

  @IsOptional()
  @IsString()
  @IsIn(['borrador', 'en_revision', 'activo', 'pausado', 'vendido', 'rechazado', 'eliminado'])
  estado?: string;
}
