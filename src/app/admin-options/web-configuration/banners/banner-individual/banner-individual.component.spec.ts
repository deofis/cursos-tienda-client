import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerIndividualComponent } from './banner-individual.component';

describe('BannerIndividualComponent', () => {
  let component: BannerIndividualComponent;
  let fixture: ComponentFixture<BannerIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannerIndividualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
