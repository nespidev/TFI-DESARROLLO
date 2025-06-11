import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EncuestasService } from '../../services/encuestas.service';
import { EncuestaDTO } from '../../interfaces/encuesta.dto';
import { PreguntaDTO } from '../../interfaces/pregunta.dto';
import { CreateEncuestaDTO } from '../../interfaces/create-encuesta.dto';
import { TiposRespuestaEnum } from '../../enums/tipos-pregunta.enum';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-visualizar-encuesta',
  standalone: true,
  templateUrl: './visualizar-encuesta.component.html',
  styleUrls: ['./visualizar-encuesta.component.css'],
  imports: [CommonModule, FormsModule]
})
export class VisualizarEncuestaComponent implements OnInit {
  encuesta!: EncuestaDTO;
  encuestaNombre: string = '';
  correoCreador: string = '';
  encuestaPublica: boolean = false;
  fechaVencimiento: string = '';
  preguntas: PreguntaDTO[] = [];
  enlaceParticipacion: string = '';
  mensaje: string = '';
  cargando = true;
  error = '';
  respuestas: { [preguntaNumero: number]: any } = {};
  tipoSeleccionado: TiposRespuestaEnum = TiposRespuestaEnum.ABIERTA;

  tiposRespuesta = [
    { tipo: 'ABIERTA', nombre: 'Abierta' },
    { tipo: 'OPCION_MULTIPLE_SELECCION_SIMPLE', nombre: 'Selección simple' },
    { tipo: 'OPCION_MULTIPLE_SELECCION_MULTIPLE', nombre: 'Selección múltiple' },
    { tipo: 'VERDADERO_FALSO', nombre: 'Verdadero/Falso' },
    { tipo: 'NUMERICA', nombre: 'Numérica' }
  ];

  constructor(
    private route: ActivatedRoute,
    private encuestaService: EncuestasService
  ) {}

  ngOnInit() {
    const codigo = this.route.snapshot.paramMap.get('codigo')!;
    this.encuestaService.obtenerEncuestaPorCodigo(codigo, 'RESPUESTA')
      .subscribe({
        next: (data) => {
          this.encuesta = data;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al obtener la encuesta:', err);
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

  rangoNumerico(min: number = 1, max: number = 10): number[] {
    const rango: number[] = [];
    for (let i = min; i <= max; i++) {
      rango.push(i);
    }
    return rango;
  }

  generarId(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }

  enviarEncuesta() {
    const encuesta: CreateEncuestaDTO = {
      nombre: this.encuestaNombre.trim(),
      correoCreador: this.correoCreador.trim() || 'demo@correo.com',
      esPublica: this.encuestaPublica,
      fechaVencimiento: this.fechaVencimiento ? new Date(this.fechaVencimiento).toISOString() : undefined,
      preguntas: this.preguntas.map(p => ({
        numero: p.numero,
        texto: p.texto.trim(),
        tipo: p.tipo,
        opciones: p.opciones.map(o => ({
          numero: o.numero,
          texto: o.texto.trim(),
        })),
        minimo: p.minimo,
        maximo: p.maximo,
      })),
      categoria: ''
    };

    this.encuestaService.crearEncuesta(encuesta).subscribe({
      next: (data) => {
        const frontendUrl = 'http://localhost:4200';
        this.enlaceParticipacion = `${frontendUrl}/participar/${data.codigoRespuesta}`;
        this.mensaje = '✅ Encuesta creada correctamente.';
        this.encuestaNombre = '';
        this.correoCreador = '';
        this.preguntas = [];
        this.encuestaPublica = false;
        this.fechaVencimiento = '';
      },
      error: () => {
        this.mensaje = '❌ Error al crear la encuesta.';
      }
    });
  }

  agregarPregunta(tipo: TiposRespuestaEnum) {
    const nuevaPregunta: PreguntaDTO = {
      id: Date.now().toString(),
      numero: this.preguntas.length + 1,
      texto: 'Nueva pregunta',
      tipo,
      opciones:
        tipo === TiposRespuestaEnum.OPCION_MULTIPLE_SELECCION_SIMPLE ||
        tipo === TiposRespuestaEnum.OPCION_MULTIPLE_SELECCION_MULTIPLE
          ? [{
              id: this.generarId('opcion'),
              numero: 1,
              texto: 'Opción 1'
            }]
          : tipo === TiposRespuestaEnum.VERDADERO_FALSO
          ? [
              { id: this.generarId('opcion'), numero: 1, texto: 'Verdadero' },
              { id: this.generarId('opcion'), numero: 2, texto: 'Falso' }
            ]
          : [],
      minimo: tipo === TiposRespuestaEnum.NUMERICA ? 1 : undefined,
      maximo: tipo === TiposRespuestaEnum.NUMERICA ? 10 : undefined
    };

    this.preguntas.push(nuevaPregunta);
  }
}
