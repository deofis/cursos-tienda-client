import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuEditComponent } from './sku-edit.component';

describe('SkuEditComponent', () => {
  let component: SkuEditComponent;
  let fixture: ComponentFixture<SkuEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkuEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkuEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
