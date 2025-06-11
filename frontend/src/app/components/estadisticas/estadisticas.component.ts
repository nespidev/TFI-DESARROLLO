import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css'],
  standalone: true,
  imports: [CommonModule] 
})
export class EstadisticasComponent implements OnInit {

  estadisticas: any = null;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('/api/v1/encuestas/estadisticas-globales')
      .subscribe({
        next: (data) => {
          console.log('Datos estadisticas:', data);
          this.estadisticas = data;  
        },
        error: () => {
          this.error = 'Error cargando estadísticas globales'; 
        }
      });
  }
}
