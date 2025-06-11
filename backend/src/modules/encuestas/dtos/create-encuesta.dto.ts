import { Type } from 'class-transformer';
import {ArrayMinSize,ArrayNotEmpty,IsArray,IsBoolean,IsDateString,IsEmail,IsNotEmpty,IsOptional,IsString,ValidateNested,} from 'class-validator';
import { CreatePreguntaDTO } from './create-pregunta.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEncuestaDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  esPublica?: boolean;

  @ApiProperty({ required: false, type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  fechaVencimiento?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  correoCreador: string;

  @ApiProperty({ type: [CreatePreguntaDTO] })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePreguntaDTO)
  preguntas: CreatePreguntaDTO[];
}
