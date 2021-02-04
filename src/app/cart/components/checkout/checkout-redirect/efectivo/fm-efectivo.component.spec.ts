import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FmEfectivoComponent } from './fm-efectivo.component';

describe('EfectivoComponent', () => {
  let component: FmEfectivoComponent;
  let fixture: ComponentFixture<FmEfectivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FmEfectivoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FmEfectivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
