import { TestBed } from '@angular/core/testing';

import { ShowComponentService } from './show-component.service';

describe('ShowComponentService', () => {
  let service: ShowComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
