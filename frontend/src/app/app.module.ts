import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component'; 
import { routes } from './app.routes';
import { ComienzoComponent } from './components/comienzo/comienzo.component';
import { SeccionComponent } from './components/seccion/seccion.component';
import { CreacionComponent } from './components/creacion/creacion.component';
import { VisualizarEncuestaComponent } from './components/visualizar-encuesta/visualizar-encuesta.component';
import { ParticiparComponent } from './participar/participar.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { ExportarCsvComponent } from './components/exportar-csv/exportar-csv.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,          
    ComienzoComponent,
    SeccionComponent,
    CreacionComponent,
    VisualizarEncuestaComponent,
    ParticiparComponent,
    EstadisticasComponent,
    ExportarCsvComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
