import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class RespuestaPreguntaDto {
  @IsNotEmpty()
  preguntaId: string;

  @IsNotEmpty()
  valor: string;
}

export class CreateRespuestaDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RespuestaPreguntaDto)
  respuestas: RespuestaPreguntaDto[];
}
