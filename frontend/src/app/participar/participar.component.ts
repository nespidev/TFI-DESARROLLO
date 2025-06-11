import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncuestasService } from '../services/encuestas.service';
import { EncuestaDTO } from '../interfaces/encuesta.dto';
import { CodigoTipoEnum } from '../enums/codigo-tipo.enum';
import { HttpClient } from '@angular/common/http';
import { CreateRespuestaDTO } from '../interfaces/create-respuesta.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-participar',
  standalone: true,
  templateUrl: './participar.component.html',
  styleUrls: ['./participar.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ParticiparComponent implements OnInit {
  encuesta!: EncuestaDTO;
  respuestas: { [preguntaNumero: number]: any } = {};
  cargando = true;
  error = '';
  mensaje = '';
  enviando = false;
  encuestaRespondida = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private encuestaService: EncuestasService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const codigo = this.route.snapshot.paramMap.get('codigo')!;
    this.encuestaService
      .obtenerEncuestaPorCodigo(codigo, CodigoTipoEnum.RESPUESTA)
      .subscribe({
        next: (data: any) => {
          this.encuesta = data;
          this.cargando = false;
        },
        error: () => {
          this.error = 'No se pudo cargar la encuesta.';
          this.cargando = false;
        }
      });
  }

  onCheckboxChange(preguntaNumero: number, valor: string, checked: boolean) {
    if (!this.respuestas[preguntaNumero]) {
      this.respuestas[preguntaNumero] = [];
    }
    if (checked) {
      this.respuestas[preguntaNumero].push(valor);
    } else {
      this.respuestas[preguntaNumero] = this.respuestas[preguntaNumero].filter(
        (v: string) => v !== valor
      );
    }
  }

  enviarRespuestas() {
    const codigo = this.route.snapshot.paramMap.get('codigo');
    if (!codigo || !this.encuesta) {
      this.error = 'Código de encuesta no válido.';
      return;
    }

    const payload: CreateRespuestaDTO = {
      respuestas: this.encuesta.preguntas.map(p => ({
        preguntaId: p.id,
        valor: this.respuestas[p.numero] ?? null
      }))
    };

    this.enviando = true;
    this.mensaje = '';

    this.http.post(`${environment.apiUrl}/encuestas/${codigo}/respuestas`, payload).subscribe({
      next: () => {
        this.mensaje = '✅ Respuestas enviadas correctamente.';
        this.enviando = false;
        this.encuestaRespondida = true;
      },
      error: () => {
        this.mensaje = '❌ Error al enviar respuestas.';
        this.enviando = false;
      }
    });
  }

  volverInicio() {
    this.router.navigate(['/']);
  }
}
