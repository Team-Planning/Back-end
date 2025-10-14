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
  Min
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
  @IsOptional()
  id_producto?: string;

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

  @IsMongoId()
  @IsNotEmpty()
  categoriaId: string;

  @IsOptional()
  @IsString()
  estado?: string; // Por defecto será "EN REVISION"

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MultimediaDto)
  multimedia?: MultimediaDto[];
}
