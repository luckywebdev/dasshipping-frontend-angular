import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import {
  Mock_CarrierRegisterResponse,
  Mock_ExpireInviteRequest,
  Mock_GetAccountInvitesListResponse,
  Mock_InviteDTO,
  Mock_ResendInviteRequest,
  Mock_SuccessDTO,
  Mock_ValidateTokenResponse,
} from '../../constants';
import { RegisterService } from './register.service';

describe('RegisterService', () => {
  let service: RegisterService;
  let httpMock: HttpTestingController;
  const offset = 0;
  const limit = 10;
  const order = 'DESC';
  const orderBy = 'name';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RegisterService, HttpClientTestingModule],
    });
    service = TestBed.get(RegisterService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should validateToken', () => {
    service.validateToken({ hash: 'test' })
      .subscribe((user) => {
        expect(user).toEqual(Mock_ValidateTokenResponse);
      });

    const req = httpMock.expectOne(`${environment.api}/register/validate-token`);
    expect(req.request.method).toBe('POST');
    req.flush(Mock_ValidateTokenResponse);
  });

  it('should common', () => {
    service.common({
      hash: 'test',
      password: 'test',
    }).subscribe((user) => {
      expect(user).toEqual(Mock_SuccessDTO);
    });

    const req = httpMock.expectOne(`${environment.api}/register/common`);
    expect(req.request.method).toBe('POST');
    req.flush(Mock_SuccessDTO);
  });

  it('should carrier', () => {
    service.carrier({
      hash: 'string',
      name: 'string',
      address: 'string',
      city: 'string',
      state: 'string',
      zip: 'string',
      dotNumber: 'string',
      msNumber: 'string',
      officePhone: 'string',
      contactPersonFirstName: 'string',
      contactPersonLastName: 'string',
      contactPersonPhone: 'string',
      mcCertificateUrl: 'string',
      insuranceUrl: 'string',
    }).subscribe((user) => {
      expect(user).toEqual(Mock_CarrierRegisterResponse);
    });

    const req = httpMock.expectOne(`${environment.api}/register/carrier`);
    expect(req.request.method).toBe('POST');
    req.flush(Mock_CarrierRegisterResponse);
  });

  it('should carrierNew', () => {
    service.carrierNew({
      name: 'string',
      address: 'string',
      city: 'string',
      state: 'string',
      zip: 'string',
      dotNumber: 'string',
      msNumber: 'string',
      officePhone: 'string',
      contactPersonFirstName: 'string',
      contactPersonLastName: 'string',
      contactPersonPhone: 'string',
      mcCertificateUrl: 'string',
      insuranceUrl: 'string',
      email: 'string',
    }).subscribe((user) => {
      expect(user).toEqual(Mock_CarrierRegisterResponse);
    });

    const req = httpMock.expectOne(`${environment.api}/register/carrier-new`);
    expect(req.request.method).toBe('POST');
    req.flush(Mock_CarrierRegisterResponse);
    httpMock.verify();
  });

  it('should inviteAccount', () => {
    service.inviteAccount({
      email: 'string',
      firstName: 'string',
      lastName: 'string',
      roleId: 1,
    }).subscribe((user) => {
      expect(user).toEqual(Mock_InviteDTO);
    });

    const req = httpMock.expectOne(`${environment.api}/register/invite-account`);
    expect(req.request.method).toBe('POST');
    req.flush(Mock_InviteDTO);
  });

  it('should inviteCarrier', () => {
    service.inviteCarrier({
      email: 'string',
      contactPersonFirstName: 'string',
      contactPersonLastName: 'string',
      dotNumber: '122222',
      msNumber: '112233',
      name: 'string',
    }).subscribe((user) => {
      expect(user).toEqual(Mock_InviteDTO);
    });

    const req = httpMock.expectOne(`${environment.api}/register/invite-carrier`);
    expect(req.request.method).toBe('POST');
    req.flush(Mock_InviteDTO);
  });

  it('should getListInvite call', () => {
    service.getListInvite()
      .subscribe((resp) => {
        expect(resp).toEqual({
          data: Mock_GetAccountInvitesListResponse.data,
          count: Mock_GetAccountInvitesListResponse.data.length,
        });
      });

    const req = httpMock.expectOne(`${environment.api}/register/invite?offset=${offset}&limit=${limit}`);
    expect(req.request.method).toBe('GET');
    req.flush({
      data: Mock_GetAccountInvitesListResponse.data,
      count: Mock_GetAccountInvitesListResponse.data.length,
    });
  });

  it('should getListInvite with query call', () => {
    service.getListInvite(offset, limit, order, orderBy)
      .subscribe((resp) => {
        expect(resp).toEqual({
          data: Mock_GetAccountInvitesListResponse.data,
          count: Mock_GetAccountInvitesListResponse.data.length,
        });
      });

    const req = httpMock.expectOne(
      `${environment.api}/register/invite?offset=${offset}&limit=${limit}&orderByDirection=DESC&orderByField=name`);
    expect(req.request.method).toBe('GET');
    req.flush({
      data: Mock_GetAccountInvitesListResponse.data,
      count: Mock_GetAccountInvitesListResponse.data.length,
    });
  });

  it('should getComapnyInvite call', () => {
    service.getComapnyInvite()
      .subscribe((resp) => {
        expect(resp).toEqual({
          data: Mock_GetAccountInvitesListResponse.data,
          count: Mock_GetAccountInvitesListResponse.data.length,
        });
      });

    const req = httpMock.expectOne(`${environment.api}/register/invite-company?offset=${offset}&limit=${limit}`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: Mock_GetAccountInvitesListResponse.data, count: Mock_GetAccountInvitesListResponse.data.length });
  });

  it('should getComapnyInvite with query call', () => {
    service.getComapnyInvite(offset, limit, order, orderBy)
      .subscribe((resp) => {
        expect(resp).toEqual({
          data: Mock_GetAccountInvitesListResponse.data,
          count: Mock_GetAccountInvitesListResponse.data.length,
        });
      });

    const req = httpMock.expectOne(
      `${environment.api}/register/invite-company?offset=${offset}&limit=${limit}&orderByDirection=DESC&orderByField=name`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: Mock_GetAccountInvitesListResponse.data, count: Mock_GetAccountInvitesListResponse.data.length });
  });

  it('should inviteResend call', () => {
    service.inviteResend(Mock_ResendInviteRequest)
      .subscribe((resp) => {
        expect(resp).toEqual(Mock_SuccessDTO);
      });

    const req = httpMock.expectOne(`${environment.api}/register/invite-resend`);
    expect(req.request.method).toBe('POST');
    req.flush(Mock_SuccessDTO);
  });

  it('should inviteExpire call', () => {
    service.inviteExpire(Mock_ExpireInviteRequest)
      .subscribe((resp) => {
        expect(resp).toEqual(Mock_SuccessDTO);
      });

    const req = httpMock.expectOne(`${environment.api}/register/invite-expire`);
    expect(req.request.method).toBe('POST');
    req.flush(Mock_SuccessDTO);
  });
});
