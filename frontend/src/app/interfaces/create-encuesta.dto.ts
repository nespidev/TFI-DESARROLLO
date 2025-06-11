
export interface CreateEncuestaDTO {
  nombre: string;
  correoCreador: string;
  preguntas: any[];
  esPublica: boolean;          
  fechaVencimiento?: string; 
  categoria: string;  
}
