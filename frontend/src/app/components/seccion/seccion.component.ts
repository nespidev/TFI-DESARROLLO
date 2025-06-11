import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { EncuestasService } from '../../services/encuestas.service';
import { EncuestaDTO } from '../../interfaces/encuesta.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seccion',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './seccion.component.html',
  styleUrls: ['./seccion.component.css'],
 

})
export class SeccionComponent implements OnInit {
  encuestas: EncuestaDTO[] = [];
  cargando = false;
  error = '';
  encuestasPorCategoria: { [categoria: string]: EncuestaDTO[] } = {};

  constructor(
    private encuestasService: EncuestasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargando = true;
    this.encuestasService.obtenerTodas().subscribe({
      next: (data) => {
        this.encuestas = data;
        this.encuestasPorCategoria = {};

        for (const encuesta of data) {
          const cat = encuesta.categoria || 'Sin categoría';
          if (!this.encuestasPorCategoria[cat]) {
            this.encuestasPorCategoria[cat] = [];
          }
          this.encuestasPorCategoria[cat].push(encuesta);
        }

        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las encuestas.';
        this.cargando = false;
      },
    });
  }

  responderEncuesta(encuesta: EncuestaDTO) {
    const codigo = encuesta.codigoRespuesta || encuesta.codigoRespuesta || encuesta.id;
    if (!codigo) {
      alert('No se pudo obtener el código de la encuesta para responder.');
      return;
    }
    this.router.navigate(['/participar', codigo]);
  }

  verEstadisticasGlobales() {
    this.router.navigate(['/estadisticas']);
  }

  exportarCSVGlobal() {
    window.open('/api/v1/encuestas/exportar-global', '_blank');
  }
}