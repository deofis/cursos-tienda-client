import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaImgSecundariaComponent } from './nueva-img-secundaria.component';

describe('NuevaImgSecundariaComponent', () => {
  let component: NuevaImgSecundariaComponent;
  let fixture: ComponentFixture<NuevaImgSecundariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevaImgSecundariaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaImgSecundariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
