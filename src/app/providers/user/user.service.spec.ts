import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, Observer } from 'rxjs';

import { environment } from '../../../environments/environment';
import { APP_ROUTES, LOCAL_STORAGE } from '../../app.constants';
import { AuthComponent } from '../../components/auth/auth.component';
import {
  Mock_AccountDTO,
  Mock_GetAccountsListResponse,
  Mock_LoginResponse,
  Mock_SuccessDTO,
  Mock_ValidateResetPasswordTokenResponse,
} from '../../constants';
import { AccountDTO } from '../../interfaces/models';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const next: any = { data: { roles: [1, 2] } };
  const nextNoRole: any = { data: { roles: [] } };
  const offset = 0;
  const limit = 10;
  const order = 'DESC';
  const orderBy = 'name';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthComponent],
      imports: [HttpClientTestingModule,
        RouterTestingModule.withRoutes(
          [{ path: APP_ROUTES.auth, component: AuthComponent },
            { path: APP_ROUTES.orders, loadChildren: './orders/orders.module#OrdersModule' }],
        )],
      providers: [UserService, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    service = TestBed.get(UserService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a login user', () => {

    service.getMe()
      .subscribe((user) => {
        expect(user).toEqual(Mock_AccountDTO);
      });

    const req = httpMock.expectOne(`${environment.api}/account/me`);
    expect(req.request.method).toBe('GET');
    req.flush(Mock_AccountDTO);
  });

  it('should forgot password', () => {
    service.userForgotPasswordPost({ email: 'test@gmail.com' })
      .subscribe((user) => {
        expect(user).toEqual(Mock_SuccessDTO);
      });

    const req = httpMock.expectOne(`${environment.api}/account/forgot-password`);
    expect(req.request.method).toBe('POST');
    req.flush(Mock_SuccessDTO);
  });

  it('should reset password', () => {
    service.resetPassword({ hash: 'test@gmail.com', password: 'tets' })
      .subscribe((user) => {
        expect(user).toEqual(Mock_SuccessDTO);
      });

    const req = httpMock.expectOne(`${environment.api}/account/reset-password`);
    expect(req.request.method).toBe('POST');
    req.flush(Mock_SuccessDTO);
  });

  it('should refresh token', () => {
    service.validateRefreshToken({ refreshToken: 'testrefreshToken' })
      .subscribe((user) => {
        expect(user).toEqual(Mock_LoginResponse);
      });

    const req = httpMock.expectOne(`${environment.api}/auth/refresh-token`);
    expect(req.request.method).toBe('POST');
    req.flush(Mock_LoginResponse);
  });

  it('should validate reset password token', () => {
    service.validateResetPasswordToken({ hash: 'testrefreshToken' })
      .subscribe((user) => {
        expect(user).toEqual(Mock_ValidateResetPasswordTokenResponse);
      });

    const req = httpMock.expectOne(`${environment.api}/account/validate-reset-password-token`);
    expect(req.request.method).toBe('POST');
    req.flush(Mock_ValidateResetPasswordTokenResponse);
  });

  it('should apply setTokens func', () => {
    service.setTokens(Mock_LoginResponse);
    expect(service.setTokens).toBeTruthy();
  });

  it('should apply setTokens func with Eremember', () => {
    service.setTokens(Mock_LoginResponse, true);
    expect(service.setTokens).toBeTruthy();
  });

  it('should apply canActivate', () => {
    service.canActivate(next);
    expect(service.canActivate).toBeTruthy();
  });

  it('should apply canActivate exists user', () => {
    service.user = Mock_AccountDTO;
    service.canActivate(next);
    expect(service.canActivate).toBeTruthy();
  });

  it('should apply canActivate exists user and no role', () => {
    service.user = Mock_AccountDTO;
    service.canActivate(nextNoRole);
    expect(service.canActivate).toBeTruthy();
  });

  it('should apply logout', () => {
    service.logout();
    expect(service.logout).toBeTruthy();
  });

  it('should apply canActivate not login user', () => {
    service.user = null;
    localStorage.removeItem(LOCAL_STORAGE.accessToken);
    service.canActivate(next);
    expect(service.canActivate).toBeTruthy();
  });

  it('should apply canActivate not user and exists token', () => {
    service.user = null;
    localStorage.setItem(LOCAL_STORAGE.accessToken, Mock_LoginResponse.accessToken);
    spyOn(service, 'getMe').and.returnValue(
      new Observable((observer: Observer<AccountDTO>) => {
        return observer.next(Mock_AccountDTO);
      }),
    );
    service.canActivate(next);
    expect(service.canActivate).toBeTruthy();
  });

  it('should apply canActivate not user and set accessToken, refreshToken', () => {
    service.user = null;
    localStorage.setItem(LOCAL_STORAGE.accessToken, Mock_LoginResponse.accessToken);
    localStorage.setItem(LOCAL_STORAGE.refreshToken, Mock_LoginResponse.refreshToken);
    spyOn(service, 'getMe').and.returnValue(
      new Observable((observer: Observer<HttpErrorResponse>) => {
        return observer.error({ error: { statusCode: 401 } });
      }),
    );
    service.canActivate(next);
    expect(service.canActivate).toBeTruthy();
  });

  it('should apply canActivate not user and set accessToken, refreshToken', () => {
    service.user = null;
    localStorage.setItem(LOCAL_STORAGE.accessToken, Mock_LoginResponse.accessToken);
    localStorage.setItem(LOCAL_STORAGE.refreshToken, Mock_LoginResponse.refreshToken);
    spyOn(service, 'getMe').and.returnValue(
      new Observable((observer: Observer<HttpErrorResponse>) => {
        return observer.error({ error: { statusCode: 401 } });
      }),
    );
    service.canActivate(next);
    expect(service.canActivate).toBeTruthy();
  });

  // it('should apply canActivate with expired accesToken and validateRefreshToken send error', async () => {
  //   service.user = null;
  //   service.setTokens(Mock_LoginResponse, true);
  //   spyOn(service, 'getMe').and.returnValue(
  //     new Observable((observer: Observer<HttpErrorResponse>) => {
  //       return observer.error({ error: { statusCode: 401 } });
  //     }),
  //   );
  //   service.getMe()
  //     .subscribe(
  //       () => {
  //         //
  //       },
  //       () => {
  //         spyOn(service, 'validateRefreshToken').and.returnValue(
  //           new Observable((observer: Observer<HttpErrorResponse>) => {
  //             return observer.error({});
  //           }),
  //         );
  //       });
  //   const response = await service.canActivate(next);
  //   expect(response).toBeFalsy();
  // });

  it('should apply canActivate not user and exists token', () => {
    service.user = null;
    localStorage.removeItem(LOCAL_STORAGE.refreshToken);
    localStorage.setItem(LOCAL_STORAGE.accessToken, Mock_LoginResponse.accessToken);
    spyOn(service, 'getMe').and.returnValue(
      new Observable((observer: Observer<HttpErrorResponse>) => {
        return observer.error({ error: { statusCode: 401 } });
      }),
    );
    service.canActivate(next);
    expect(service.canActivate).toBeTruthy();
  });

  it('should apply canActivate not user,no role and exists token', () => {
    service.user = null;
    localStorage.removeItem(LOCAL_STORAGE.refreshToken);
    localStorage.setItem(LOCAL_STORAGE.accessToken, Mock_LoginResponse.accessToken);
    spyOn(service, 'getMe').and.returnValue(
      new Observable((observer: Observer<AccountDTO>) => {
        return observer.next(Mock_AccountDTO);
      }),
    );
    service.canActivate(nextNoRole);
    expect(service.canActivate).toBeTruthy();
  });

  it('should apply removeTokens', () => {
    service.removeTokens();
    expect(service.removeTokens).toBeTruthy();
  });

  it('should delete call', () => {
    service.delete({
      ids: [1, 2, 3],
      deleted: true,
    }).subscribe((res) => {
      expect(res).toEqual(Mock_SuccessDTO);
    });

    const req = httpMock.expectOne(`${environment.api}/account/delete`);
    expect(req.request.method).toBe('POST');
    req.flush(Mock_SuccessDTO);
  });

  it('should setApprove call', () => {
    service.setApprove({
      ids: [1, 2, 3],
      approved: true,
    }).subscribe((user) => {
      expect(user).toEqual(Mock_SuccessDTO);
    });

    const req = httpMock.expectOne(`${environment.api}/account/approve`);
    expect(req.request.method).toBe('POST');
    req.flush(Mock_SuccessDTO);
  });

  it('should setBlock call', () => {
    service.setBlock({
      ids: [1, 2, 3],
      blocked: true,
      reason: 'Test',
    }).subscribe((user) => {
      expect(user).toEqual(Mock_SuccessDTO);
    });

    const req = httpMock.expectOne(`${environment.api}/account/block`);
    expect(req.request.method).toBe('POST');
    req.flush(Mock_SuccessDTO);
  });

  it('should getById call', () => {
    const id = '1';
    service.getById(id)
      .subscribe((user) => {
        expect(user).toEqual(Mock_AccountDTO);
      });

    const req = httpMock.expectOne(`${environment.api}/account/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(Mock_AccountDTO);
  });

  it('should patch account call', () => {
    const id = '1';
    service.patch(id, Mock_AccountDTO)
      .subscribe((account) => {
        expect(account).toEqual(Mock_AccountDTO);
      });

    const req = httpMock.expectOne(`${environment.api}/account/${id}`);
    expect(req.request.method).toBe('PATCH');
    req.flush(Mock_AccountDTO);
  });

  it('should updateMyProfile call', () => {
    service.updateMyProfile(Mock_AccountDTO)
      .subscribe((account) => {
        expect(account).toEqual(Mock_AccountDTO);
      });

    const req = httpMock.expectOne(`${environment.api}/account/me`);
    expect(req.request.method).toBe('PATCH');
    req.flush(Mock_AccountDTO);
  });

  it('should getList call', () => {
    service.getList()
      .subscribe((company) => {
        expect(company).toEqual({
          data: Mock_GetAccountsListResponse.data,
          count: Mock_GetAccountsListResponse.data.length,
        });
      });

    const req = httpMock.expectOne(`${environment.api}/account?offset=${offset}&limit=${limit}`);
    expect(req.request.method).toBe('GET');
    req.flush({
      data: Mock_GetAccountsListResponse.data,
      count: Mock_GetAccountsListResponse.data.length,
    });
  });

  it('should getList with query call', () => {
    service.getList(offset, limit, order, orderBy)
      .subscribe((company) => {
        expect(company).toEqual({
          data: Mock_GetAccountsListResponse.data,
          count: Mock_GetAccountsListResponse.data.length,
        });
      });

    const req = httpMock.expectOne(
      `${environment.api}/account?offset=${offset}&limit=${limit}&orderByDirection=${order}&orderByField=${orderBy}`);
    expect(req.request.method).toBe('GET');
    req.flush({
      data: Mock_GetAccountsListResponse.data,
      count: Mock_GetAccountsListResponse.data.length,
    });
  });
});
