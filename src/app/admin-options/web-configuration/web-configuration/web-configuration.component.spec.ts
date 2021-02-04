import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebConfigurationComponent } from './web-configuration.component';

describe('WebConfigurationComponent', () => {
  let component: WebConfigurationComponent;
  let fixture: ComponentFixture<WebConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
