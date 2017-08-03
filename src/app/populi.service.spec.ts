import { TestBed, inject } from '@angular/core/testing';

import { PopuliServiceService } from './populi-service.service';

describe('PopuliServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PopuliServiceService]
    });
  });

  it('should be created', inject([PopuliServiceService], (service: PopuliServiceService) => {
    expect(service).toBeTruthy();
  }));
});
