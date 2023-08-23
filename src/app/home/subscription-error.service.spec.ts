import { TestBed } from '@angular/core/testing';

import { SubscriptionErrorService } from './subscription-error.service';

describe('SubscriptionErrorService', () => {
  let service: SubscriptionErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
