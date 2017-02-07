/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BioAppMainServiceService } from './bio-app-main-service.service';

describe('BioAppMainServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BioAppMainServiceService]
    });
  });

  it('should ...', inject([BioAppMainServiceService], (service: BioAppMainServiceService) => {
    expect(service).toBeTruthy();
  }));
});
