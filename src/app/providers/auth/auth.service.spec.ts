import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { environment } from '../../../environments/environment';
import { Mock_LoginResponse } from '../../constants';
import { AuthService } from './auth.service';

describe('UserService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService, HttpClientTestingModule],
    });
    service = TestBed.get(AuthService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should apply authLoginPost', () => {
    service.authLoginPost({ email: 'test@gmail.com', password: 'test' })
      .subscribe((user) => {
        expect(user).toEqual(Mock_LoginResponse);
      });

    const req = httpMock.expectOne(`${environment.api}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(Mock_LoginResponse);
  });

});
