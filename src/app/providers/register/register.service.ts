import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CarrierEditRegisterRequest } from '../../interfaces/carrierEditRegisterRequest';
import { GetInvitationsListResponse } from '../../interfaces/getInvitationsListResponse';
import {
  AccountInviteRequest,
  CarrierInviteRequest,
  CarrierNewRegisterRequest,
  CarrierNewRegisterResponse,
  CarrierRegisterRequest,
  CarrierRegisterResponse,
  CommonRegisterRequest,
  CommonRegisterResponse,
  CompanyDTO,
  ExpireInviteRequest,
  ExpireInviteResponse,
  InviteDTO,
  ResendInviteRequest,
  ResendInviteResponse,
  SuccessDTO,
  ValidateTokenRequest,
  ValidateTokenResponse,
} from '../../interfaces/models';

@Injectable()
export class RegisterService {

  constructor(private http: HttpClient) { }

  public validateToken(data: ValidateTokenRequest): Observable<ValidateTokenResponse> {
    return this.http.post<ValidateTokenResponse>(`${environment.api}/register/validate-token`, data);
  }

  public getByHash(hash: string): Observable<CompanyDTO> {
    return this.http.get<CompanyDTO>(`${environment.api}/register/company/${hash}`);
  }

  public common(data: CommonRegisterRequest): Observable<CommonRegisterResponse> {
    return this.http.post<CommonRegisterResponse>(`${environment.api}/register/common`, data);
  }

  public carrier(data: CarrierRegisterRequest): Observable<CarrierRegisterResponse> {
    return this.http.post<CarrierRegisterResponse>(`${environment.api}/register/carrier`, data);
  }

  public updateCarrier(data: CarrierEditRegisterRequest): Observable<SuccessDTO> {
    return this.http.patch<SuccessDTO>(`${environment.api}/register/carrier`, data);
  }

  public carrierNew(data: CarrierNewRegisterRequest): Observable<CarrierNewRegisterResponse> {
    return this.http.post<CarrierRegisterResponse>(`${environment.api}/register/carrier-new`, data);
  }

  public inviteAccount(data: AccountInviteRequest): Observable<InviteDTO> {
    return this.http.post<InviteDTO>(`${environment.api}/register/invite-account`, data);
  }

  public inviteCarrier(data: CarrierInviteRequest): Observable<InviteDTO> {
    return this.http.post<InviteDTO>(`${environment.api}/register/invite-carrier`, data);
  }

  public declineInviteAccount(hash: string): Observable<SuccessDTO> {
    return this.http.post<SuccessDTO>(`${environment.api}/register/invite-account-decline`, { hash });
  }

  public declineInviteCarrier(hash: string): Observable<SuccessDTO> {
    return this.http.post<SuccessDTO>(`${environment.api}/register/invite-carrier-decline`, { hash });
  }

  public getInviteExists(dotNumber, msNumber): Observable<InviteDTO> {
    return this.http.get<InviteDTO>(`${environment.api}/register/invite-exists?dotNumber=${dotNumber}&msNumber=${msNumber}`);
  }

  public getListInvite(
    offset: number = 0,
    limit: number = 10,
    order: string = null,
    orderBy: string = null): Observable<GetInvitationsListResponse> {
    const orderUrl = order ? `&orderByDirection=${order.toLocaleUpperCase()}` : '';
    const orderByUrl = order ? `&orderByField=${orderBy}` : '';
    return this.http.get<GetInvitationsListResponse>(
      `${environment.api}/register/invite?offset=${offset}&limit=${limit}${orderUrl}${orderByUrl}`);
  }

  public getComapnyInvite(
    offset: number = 0,
    limit: number = 10,
    order: string = null,
    orderBy: string = null): Observable<GetInvitationsListResponse> {
    const orderUrl = order ? `&orderByDirection=${order.toLocaleUpperCase()}` : '';
    const orderByUrl = order ? `&orderByField=${orderBy}` : '';
    return this.http.get<GetInvitationsListResponse>(
      `${environment.api}/register/invite-company?offset=${offset}&limit=${limit}${orderUrl}${orderByUrl}`);
  }

  public inviteResend(data: ResendInviteRequest): Observable<ResendInviteResponse> {
    return this.http.post<ResendInviteResponse>(`${environment.api}/register/invite-resend`, data);
  }

  public inviteExpire(data: ExpireInviteRequest): Observable<ExpireInviteResponse> {
    return this.http.post<ExpireInviteResponse>(`${environment.api}/register/invite-expire`, data);
  }

  public retrieveDispatch(id: number): Observable<SuccessDTO> {
    return this.http.post<SuccessDTO>(`${environment.api}/register/invite-retrieve/${id}`, {});
  }
}
