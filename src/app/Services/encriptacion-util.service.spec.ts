import { TestBed } from '@angular/core/testing';

import { EncriptacionUtilService } from './encriptacion-util.service';

describe('EncriptacionUtilService', () => {
  let service: EncriptacionUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncriptacionUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
