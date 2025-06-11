import { Routes } from '@angular/router';
import { ComienzoComponent } from './components/comienzo/comienzo.component';
import { SeccionComponent } from './components/seccion/seccion.component';
import { CreacionComponent } from './components/creacion/creacion.component';
import { VisualizarEncuestaComponent } from './components/visualizar-encuesta/visualizar-encuesta.component';
import { ParticiparComponent } from './participar/participar.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { ExportarCsvComponent } from './components/exportar-csv/exportar-csv.component';

export const routes: Routes = [
  { path: '', component: ComienzoComponent },
  { path: 'seccion', component: SeccionComponent },
  { path: 'creacion', component: CreacionComponent },
  { path: 'visualizar/:id/:codigo', component: VisualizarEncuestaComponent },
  { path: 'participar/:codigo', component: ParticiparComponent },
  { path: 'estadisticas', component: EstadisticasComponent },
  { path: 'exportar-csv', component: ExportarCsvComponent },
];
