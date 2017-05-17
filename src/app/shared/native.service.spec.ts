import { TestBed, inject } from '@angular/core/testing';

import { NativeService } from './native.service';

describe('NativeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NativeService]
    });
  });

  it('should be created', inject([NativeService], (service: NativeService) => {
    expect(service).toBeTruthy();
  }));

  it('should return string', inject([NativeService], (service: NativeService) => {
    expect(typeof service.inject('iframe', []) === 'string').toBe(true);
    expect(typeof service.inject('worker', []) === 'string').toBe(true);
  }));
});
