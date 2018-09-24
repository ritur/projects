import { TestBed, inject } from '@angular/core/testing';

import { AdminapiService } from './adminapi.service';

describe('AdminapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminapiService]
    });
  });

  it('should be created', inject([AdminapiService], (service: AdminapiService) => {
    expect(service).toBeTruthy();
  }));
});
