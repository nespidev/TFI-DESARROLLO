import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EncuestaDTO } from '../interfaces/encuesta.dto';
import { CreateEncuestaDTO } from '../interfaces/create-encuesta.dto';
import { CreateRespuestaDTO } from '../interfaces/create-respuesta.dto';

@Injectable({
  providedIn: 'root',
})
export class EncuestasService {
  private baseUrl = '/api/v1/encuestas';

  constructor(private http: HttpClient) {}

  obtenerTodas(): Observable<EncuestaDTO[]> {
    return this.http.get<EncuestaDTO[]>(this.baseUrl);
  }

  obtenerPorId(id: number): Observable<EncuestaDTO> {
    return this.http.get<EncuestaDTO>(`${this.baseUrl}/${id}`);
  }

  crearEncuesta(dto: CreateEncuestaDTO): Observable<any> {
    return this.http.post(this.baseUrl, dto);
  }

  obtenerEncuestaPorCodigo(codigo: string, tipo: 'RESPUESTA' | 'RESULTADOS'): Observable<EncuestaDTO> {
    const url = `${this.baseUrl}/codigo/${codigo}`;
    const params = { tipo };
    return this.http.get<EncuestaDTO>(url, { params });
  }

  enviarRespuestas(codigoRespuesta: string, dto: CreateRespuestaDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/${codigoRespuesta}/respuestas`, dto);
  }

  obtenerCSV(idEncuesta: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${idEncuesta}/exportar`, { responseType: 'blob' });
  }
  
  obtenerEstadisticas(idEncuesta: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${idEncuesta}/estadisticas`);
  }
  
}
