import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ROLES_STATUS } from '../../enums';
import { BlockCompanyResponse } from '../../interfaces/blockCompanyResponse';
import {
  BlockCompanyRequest,
  CompanyDTO,
  GetCompanyListRequest,
  GetCompanyListResponse,
  GetOrdersListResponse,
  GetOrdersRequest,
  OrderDTO,
  PatchCompanyRequest,
  SuccessDTO,
} from '../../interfaces/models';
import { UserService } from '../user/user.service';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  @Output() changeRequested: EventEmitter<boolean> = new EventEmitter();
  PATH = {
    2: '/company/me/load-board/',
    4: '/dispatchers/me/load-board/',
  };

  PATH_COMPANY = {
    1: '/company/{id}',
    2: '/company/me',
    4: '/dispatchers/me/company/',
  };

  constructor(
    protected httpClient: HttpClient,
    private userService: UserService,
  ) {
  }

  private encodeData(data) {
    return Object.keys(data).filter(key => data[key]).map((key) => {
      return [key, data[key]].map(encodeURIComponent).join('=');
    }).join('&');
  }

  public getList(filter: GetCompanyListRequest): Observable<GetCompanyListResponse> {
    const filterPath = this.encodeData(filter);
    return this.httpClient.get<GetCompanyListResponse>(
      `${environment.api}/company?${filterPath}`);
  }

  public getOrdersMe(filter: GetOrdersRequest, status: string): Observable<GetOrdersListResponse> {
    const filterPath = this.encodeData(filter);
    const { user } = this.userService;
    const path = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.get<GetOrdersListResponse>(`${environment.api}${path}${status}?${filterPath}`);
  }

  public getLoadBoard(filter: GetOrdersRequest): Observable<GetOrdersListResponse> {
    const filterPath = this.encodeData(filter);
    return this.httpClient.get<GetOrdersListResponse>(`${environment.api}/company/me/orders/available?${filterPath}`);
  }

  public getOrders(status: string, filter: GetOrdersRequest): Observable<GetOrdersListResponse> {
    const filterPath = this.encodeData(filter);
    return this.httpClient.get<GetOrdersListResponse>(`${environment.api}/company/me/orders/${status}?${filterPath}`);
  }

  public getOrder(id: string): Observable<OrderDTO> {
    const include = 'include=pickLocation,deliveryLocation,receiver,sender,company,cars,createdBy,shipper,inspections';
    const { user } = this.userService;
    const path = user && user.roleId === ROLES_STATUS.COMPANY_ADMIN ? 'company' : 'dispatchers';
    return this.httpClient.get<OrderDTO>(`${environment.api}/${path}/me/orders/${id}?${include}`);
  }

  public get(id?: string): Observable<CompanyDTO> {
    const { user } = this.userService;
    const path = user && user.roleId ? this.PATH_COMPANY[user.roleId] : this.PATH_COMPANY[2];
    return this.httpClient.get<CompanyDTO>(`${environment.api}${path.replace('{id}', id)}`);
  }

  public update(data: PatchCompanyRequest, id: string = 'me'): Observable<CompanyDTO> {
    return this.httpClient.patch<CompanyDTO>(`${environment.api}/company/${id}`, data);
  }

  public setBlock(data: BlockCompanyRequest): Observable<BlockCompanyResponse> {
    return this.httpClient.post<BlockCompanyResponse>(`${environment.api}/company/block`, data);
  }

  public blockCompany(id: number, blocked = true): Observable<SuccessDTO> {
    return this.httpClient.post<SuccessDTO>(`${environment.api}/company/block/${id}`, { blocked });
  }

  public aproveCompany(id: number): Observable<SuccessDTO> {
    return this.httpClient.post<SuccessDTO>(`${environment.api}/company/approve`, { id });
  }

  public requestChangesCompany(data: { id: number; message: string; }): Observable<SuccessDTO> {
    return this.httpClient.post<SuccessDTO>(`${environment.api}/company/requested-changes`, data);
  }
}
