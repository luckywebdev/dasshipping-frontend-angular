import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { DispatchListRequest } from '../../interfaces/dispatchListRequest';
import { DispatchListResponseDTO } from '../../interfaces/dispatchListResponseDTO';
import { DispatchDTO, DispatchRequestDTO } from '../../interfaces/models';

@Injectable({ providedIn: 'root' })
export class DispatchService {

  constructor(protected httpClient: HttpClient) { }

  private encodeData(data) {
    return Object.keys(data).filter(key => data[key]).map((key) => {
      return [key, data[key]].map(encodeURIComponent).join('=');
    }).join('&');
  }

  public create(data: DispatchRequestDTO): Observable<DispatchDTO> {
    return this.httpClient.post<DispatchDTO>(`${environment.api}/dispatch`, data);
  }

  public accept(id: number): Observable<DispatchDTO> {
    return this.httpClient.post<DispatchDTO>(`${environment.api}/dispatch/${id}/accept`, {});
  }

  public update(id: number, data: DispatchRequestDTO): Observable<DispatchDTO> {
    return this.httpClient.patch<DispatchDTO>(`${environment.api}/dispatch/${id}`, data);
  }

  public getList(orderId: string, filter: DispatchListRequest): Observable<DispatchListResponseDTO> {
    const filterUrl = this.encodeData(filter);
    return this.httpClient.get<DispatchListResponseDTO>(`${environment.api}/dispatch?orderId=${orderId}${filterUrl}`);
  }

}
