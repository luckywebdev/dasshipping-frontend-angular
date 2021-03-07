import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { APP_ROUTES } from '../../app.constants';
import { ErrorComponent } from '../../components/error/error.component';
import { ErrorService } from './error.service';

describe('ErrorService', () => {
  let service: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorComponent],
      imports: [
        RouterTestingModule.withRoutes(
          [{ path: APP_ROUTES.error, component: ErrorComponent }],
        ),
        HttpClientTestingModule,
      ],
      providers: [ErrorService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    service = TestBed.get(ErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should apply navigate', () => {
    service.navigate({
      error: '',
      message: 'Not exists',
      statusCode: 400,
    });
    expect(service.navigate).toBeTruthy();
  });
});
