import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificationService],
    });
    service = TestBed.get(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should apply success', () => {
    service.success('Success');
    expect(service.success).toBeTruthy();
  });

  it('should apply error', () => {
    service.error('Error');
    expect(service.error).toBeTruthy();
  });

});
