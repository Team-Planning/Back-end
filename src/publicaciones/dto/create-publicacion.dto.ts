import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  Min,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsMongoId,
  IsOptional
} from 'class-validator';

export class CreatePublicacionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  titulo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  descripcion: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsMongoId()
  categoria: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(6)
  @IsMongoId({ each: true })
  imagenes: string[];

  @IsString()
  @IsNotEmpty()
  vendedorId: string;

  @IsOptional()
  @IsString()
  estado?: string; // Se puede omitir, por defecto será "revision"
}
