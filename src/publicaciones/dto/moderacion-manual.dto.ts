import {
  IsString,
  IsOptional,
  IsIn,
} from 'class-validator';

export class ModeracionManualDto {
  @IsString()
  @IsOptional()
  id_moderador?: string;

  @IsIn(['aprobado', 'rechazado'])
  accion: 'aprobado' | 'rechazado';

  @IsString()
  motivo: string;
}