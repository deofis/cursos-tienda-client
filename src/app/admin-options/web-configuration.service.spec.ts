import { TestBed } from '@angular/core/testing';

import { WebConfigurationService } from './web-configuration.service';

describe('WebConfigurationService', () => {
  let service: WebConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
