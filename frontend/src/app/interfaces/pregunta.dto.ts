import { TiposRespuestaEnum } from "../enums/tipos-pregunta.enum";
import { OpcionDTO } from "./opcion.dto";

export interface PreguntaDTO {
  id: string;
  numero: number;
  texto: string;
  tipo: TiposRespuestaEnum;
  opciones: OpcionDTO[]; 
  minimo?: number;
  maximo?: number;
}