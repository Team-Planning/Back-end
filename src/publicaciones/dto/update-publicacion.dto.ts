import {
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  Min,
  IsMongoId,
  IsArray,
  ArrayMaxSize
} from 'class-validator';

export class UpdatePublicacionDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  titulo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precio?: number;

  @IsOptional()
  @IsMongoId()
  categoria?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(6)
  @IsMongoId({ each: true })
  imagenes?: string[];

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  comentarioModerador?: string;
}
