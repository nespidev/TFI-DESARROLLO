import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticiparComponent } from './participar.component';

describe('ParticiparComponent', () => {
  let component: ParticiparComponent;
  let fixture: ComponentFixture<ParticiparComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticiparComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticiparComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
