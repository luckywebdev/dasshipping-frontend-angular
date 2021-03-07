import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { GetPolicyListResponse, PolicyCreateRequest, PolicyDTO, SuccessDTO } from '../../interfaces/models';

@Injectable({ providedIn: 'root' })
export class PolicyService {

  constructor(protected httpClient: HttpClient) { }

  public getList(
    offset: number = 0,
    limit: number = 10,
    order: string = null,
    orderBy: string = null): Observable<GetPolicyListResponse> {
    const orderUrl = order ? `&orderByDirection=${order.toLocaleUpperCase()}` : '';
    const orderByUrl = orderBy ? `&orderByField=${orderBy}` : '';
    return this.httpClient.get<GetPolicyListResponse>(
      `${environment.api}/policy?offset=${offset}&limit=${limit}${orderUrl}${orderByUrl}`);
  }

  public delete(id: number): Observable<SuccessDTO> {
    return this.httpClient.delete<SuccessDTO>(`${environment.api}/policy/${id}`);
  }

  public update(id: number, data: PolicyCreateRequest): Observable<PolicyDTO> {
    return this.httpClient.patch<PolicyDTO>(`${environment.api}/policy/${id}`, data);
  }

  public create(data: PolicyCreateRequest): Observable<PolicyDTO> {
    return this.httpClient.post<PolicyDTO>(`${environment.api}/policy`, data);
  }

  public sync(): Observable<SuccessDTO> {
    return this.httpClient.post<SuccessDTO>(`${environment.api}/policy/sync`, {});
  }
}
