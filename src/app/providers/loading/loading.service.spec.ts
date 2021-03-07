import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoadingService],
    });
    service = TestBed.get(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set loading true', () => {
    service.loading = true;
    expect(service.loading).toBeTruthy();
  });

  it('should set loading false', () => {
    service.loading = false;
    expect(service.loading).toBeFalsy();
  });

  it('should apply startLoading', () => {
    service.startLoading();
    expect(service.startLoading).toBeTruthy();
  });

  it('should apply stopLoading', () => {
    service.stopLoading();
    expect(service.stopLoading).toBeTruthy();
  });

});
