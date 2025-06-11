import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-comienzo',
  standalone: true,
  imports: [ButtonModule, RouterModule],
  templateUrl: './comienzo.component.html',
  styleUrls: ['./comienzo.component.css']
})
export class ComienzoComponent {}
