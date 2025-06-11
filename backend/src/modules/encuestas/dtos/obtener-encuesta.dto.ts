import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CodigoTipoEnum } from '../enums/codigo-tipo.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ObtenerEncuestaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  codigo: string;

  @ApiProperty({ enum: CodigoTipoEnum })
  @IsEnum(CodigoTipoEnum)
  @IsNotEmpty()
  @IsOptional()
  tipo: CodigoTipoEnum;
}
