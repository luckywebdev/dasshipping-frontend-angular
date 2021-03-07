import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { GetJoinedRequestsResponse, JoinRequestDTO } from '../../interfaces/models';

@Injectable({ providedIn: 'root' })
export class JoinRequestsService {

  constructor(protected httpClient: HttpClient) { }

  public getList(
    offset: number = 0,
    limit: number = 10,
    order: string = null,
    orderBy: string = null): Observable<GetJoinedRequestsResponse> {
    const orderUrl = order ? `&orderByDirection=${order.toLocaleUpperCase()}` : '';
    const orderByUrl = order ? `&orderByField=${orderBy}` : '';
    return this.httpClient.get<GetJoinedRequestsResponse>(
      `${environment.api}/join-request?offset=${offset}&limit=${limit}${orderUrl}${orderByUrl}`);
  }

  public action(id: number, action: string): Observable<JoinRequestDTO> {
    return this.httpClient.post<JoinRequestDTO>(`${environment.api}/join-request/${id}/${action}`, {});
  }

  public bulkAction(ids: number[], action: string): Observable<JoinRequestDTO[]> {
    const requests = [];
    ids.forEach((id) => {
      requests.push(this.httpClient.post(`${environment.api}/join-request/${id}/${action}`, {}));
    });
    return forkJoin(requests);
  }
}
