import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgSecundariasComponent } from './img-secundarias.component';

describe('ImgSecundariasComponent', () => {
  let component: ImgSecundariasComponent;
  let fixture: ComponentFixture<ImgSecundariasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImgSecundariasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgSecundariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
