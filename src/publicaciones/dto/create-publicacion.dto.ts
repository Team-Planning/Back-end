import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsArray,
  IsMongoId,
  IsOptional,
  ValidateNested,
  IsInt,
  Min,
  IsNumber,
  IsIn
} from 'class-validator';
import { Type } from 'class-transformer';

class MultimediaDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsInt()
  @Min(0)
  orden: number;

  @IsString()
  @IsOptional()
  tipo?: string; // "imagen" o "video"
}

export class CreatePublicacionDto {
  @IsString()
  @IsNotEmpty()
  id_vendedor: string;

  @IsString()
  @IsNotEmpty()
  id_producto: string; // Referencia al microservicio de productos

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  titulo: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  descripcion: string;

  @IsString()
  @IsOptional()
  @IsIn(['retiro_en_tienda', 'envio', 'ambos'])
  despacho?: string; // Por defecto será "retiro_en_tienda"

  @IsNumber()
  @IsOptional()
  @Min(0)
  precio_envio?: number;

  @IsOptional()
  @IsString()
  @IsIn(['borrador', 'en_revision', 'activo', 'pausado', 'vendido', 'rechazado', 'eliminado'])
  estado?: string; // Por defecto será "en_revision"

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MultimediaDto)
  multimedia?: MultimediaDto[];
}
