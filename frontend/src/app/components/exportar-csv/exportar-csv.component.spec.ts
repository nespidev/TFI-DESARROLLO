import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportarCsvComponent } from './exportar-csv.component';

describe('ExportarCsvComponent', () => {
  let component: ExportarCsvComponent;
  let fixture: ComponentFixture<ExportarCsvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportarCsvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportarCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
