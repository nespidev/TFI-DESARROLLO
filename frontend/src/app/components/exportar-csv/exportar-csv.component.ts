import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-exportar-csv',
  templateUrl: './exportar-csv.component.html',
  styleUrls: ['./exportar-csv.component.css']
  
})

export class ExportarCsvComponent implements OnInit {

  idEncuesta!: string;
  error = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.idEncuesta = this.route.snapshot.paramMap.get('id') || '';
  }

  descargarCSV(): void {
    if (!this.idEncuesta) {
      this.error = 'No se ha especificado la encuesta.';
      return;
    }

    this.http.get(`/api/v1/encuestas/${this.idEncuesta}/exportar`, {
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `encuesta_${this.idEncuesta}_respuestas.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.error = 'Error descargando el CSV'
    });
  }
}
