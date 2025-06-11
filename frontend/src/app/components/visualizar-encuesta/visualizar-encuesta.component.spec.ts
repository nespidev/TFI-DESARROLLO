import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VisualizarEncuestaComponent } from './visualizar-encuesta.component';

describe('VisualizarEncuestaComponent', () => {
  let component: VisualizarEncuestaComponent;
  let fixture: ComponentFixture<VisualizarEncuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisualizarEncuestaComponent],
      imports: [CommonModule, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(VisualizarEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
