import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsArray,
  IsOptional,
  ValidateNested,
  IsInt,
  Min,
  IsNumber,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MultimediaDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsInt()
  @Min(0)
  orden: number;

  @IsString()
  @IsOptional()
  @IsIn(['imagen', 'video'])
  tipo?: string;

  @IsString()
  @IsOptional()
  cloudinary_public_id?: string;
}

export class CreatePublicacionDto {
  @IsString()
  @IsNotEmpty()
  id_vendedor: string;

  @IsString()
  @IsNotEmpty()
  id_producto: string;

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
  despacho?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  precio_envio?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MultimediaDto)
  multimedia?: MultimediaDto[];
}
