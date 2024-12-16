import { TestBed } from '@angular/core/testing';

import { ConvertsService } from './converts.service';

describe('ConvertsService', () => {
  let service: ConvertsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvertsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
