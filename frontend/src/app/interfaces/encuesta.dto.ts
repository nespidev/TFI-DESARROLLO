import { PreguntaDTO } from './pregunta.dto';

export interface EncuestaDTO {
  categoria: string;
  id: string;
  nombre: string;
  preguntas: PreguntaDTO[];
  codigoRespuesta?: string; 
}
