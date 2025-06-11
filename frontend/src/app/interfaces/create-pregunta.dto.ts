import { TiposRespuestaEnum } from "../enums/tipos-pregunta.enum";
import { CreateOpcionDTO } from "./create-opcion.dto";

export interface CreatePreguntaDTO {
  id: string;
  numero: number;
  texto: string;
  tipo: TiposRespuestaEnum;
  opciones?: CreateOpcionDTO[];
  minimo?: number;
  maximo?: number;
}