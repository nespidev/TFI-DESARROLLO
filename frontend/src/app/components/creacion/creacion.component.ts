import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EncuestasService } from '../../services/encuestas.service';
import { CreateEncuestaDTO } from '../../interfaces/create-encuesta.dto';
import { TiposRespuestaEnum, tiposPreguntaPresentacion } from '../../enums/tipos-pregunta.enum';

@Component({
  selector: 'app-creacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './creacion.component.html',
  styleUrls: ['./creacion.component.css'],
})
export class CreacionComponent {
  correoCreador = '';
  encuestaNombre = '';
  categoria = '';
  categorias = ['Educación', 'Salud', 'Tecnología', 'Deportes', 'Otros'];
  preguntas: {
    id: string;   
    numero: number;
    texto: string;
    tipo: TiposRespuestaEnum;
    opciones: { id: string; numero: number; texto: string }[];
    minimo?: number;
    maximo?: number;
  }[] = [];

  tiposRespuesta = tiposPreguntaPresentacion;
  mensaje = '';
  enlaceParticipacion = '';
  public encuestaPublica = false;
  public fechaVencimiento = '';

  constructor(private encuestaService: EncuestasService) {}

  generarId(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }

  agregarPregunta(tipo: TiposRespuestaEnum = TiposRespuestaEnum.ABIERTA) {
    const nuevaPregunta = {
      id: this.generarId('pregunta'),
      numero: this.preguntas.length + 1,
      texto: '',
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
      maximo: tipo === TiposRespuestaEnum.NUMERICA ? 10 : undefined,
    };

    this.preguntas.push(nuevaPregunta);
  }

  agregarOpcion(preguntaIndex: number) {
    this.preguntas[preguntaIndex].opciones.push({
      id: this.generarId('opcion'),
      numero: this.preguntas[preguntaIndex].opciones.length + 1,
      texto: '',
    });
  }

  copiarEnlace() {
    if (!this.enlaceParticipacion) return;
    navigator.clipboard.writeText(this.enlaceParticipacion).then(() => {
      alert('📋 Enlace copiado al portapapeles');
    });
  }

  enviarEncuesta() {
    if (!this.categoria.trim()) {
      this.mensaje = 'La categoría es obligatoria';
      return;
    }
  
    if (this.preguntas.length === 0) {
      this.mensaje = 'Debe agregar al menos una pregunta';
      return;
    }
  
    for (const p of this.preguntas) {
      if (!p.texto.trim()) {
        this.mensaje = `La pregunta #${p.numero} no puede estar vacía`;
        return;
      }
      if (
        (p.tipo === TiposRespuestaEnum.OPCION_MULTIPLE_SELECCION_SIMPLE ||
         p.tipo === TiposRespuestaEnum.OPCION_MULTIPLE_SELECCION_MULTIPLE) &&
        p.opciones.length === 0
      ) {
        this.mensaje = `La pregunta #${p.numero} debe tener al menos una opción`;
        return;
      }
    }
  
    const encuesta: CreateEncuestaDTO = {
      nombre: this.encuestaNombre.trim(),
      correoCreador: this.correoCreador.trim() || 'demo@correo.com',
      categoria: this.categoria,
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
    }
    this.encuestaService.crearEncuesta(encuesta).subscribe({
      next: (data) => {
        const frontendUrl = 'http://localhost:4200';
        this.enlaceParticipacion = `${frontendUrl}/participar/${data.codigoRespuesta || data.codigo_respuesta}`;
        this.mensaje = '✅ Encuesta creada correctamente.';
        this.encuestaNombre = '';
        this.correoCreador = '';
        this.categoria = ''; 
        this.preguntas = [];
        this.encuestaPublica = false;
        this.fechaVencimiento = '';
      },
      error: (err) => {
        console.error('Error al crear encuesta:', err);
        this.mensaje = '❌ Error al crear la encuesta.';
      },
    });
  }
}
