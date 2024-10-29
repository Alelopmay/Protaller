import { TestBed } from '@angular/core/testing';

import { LeafletService } from './leaflef.service';

describe('LeaflefService', () => {
  let service: LeafletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeafletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
