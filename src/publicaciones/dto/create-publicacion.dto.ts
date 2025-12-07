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
  @IsInt()
  @IsOptional()
  id_vendedor?: number;

  @IsInt()
  @IsOptional()
  id_tienda?: number;

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

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MultimediaDto)
  multimedia?: MultimediaDto[];

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  precio: number;
}
