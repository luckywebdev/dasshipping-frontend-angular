import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { EditLeadRequest, GetLeadsListResponse, GetLeadsRequest, QuoteDTO, SuccessDTO } from '../../interfaces/models';

@Injectable({ providedIn: 'root' })
export class LeadService {
  @Output() changeRequested: EventEmitter<boolean> = new EventEmitter();
  LEADS = {
    news: 'new-leads',
    quoted: 'quoted',
  };
  constructor(protected httpClient: HttpClient) { }

  private encodeData(data) {
    return Object.keys(data)
      .filter(key => data[key])
      .map((key) => {
        return [key, data[key]].map(encodeURIComponent).join('=');
      })
      .join('&');
  }

  public getList(
    filter: GetLeadsRequest,
    status,
  ): Observable<GetLeadsListResponse> {
    const filterPath = this.encodeData(filter);
    return this.httpClient.get<GetLeadsListResponse>(
      `${environment.api}/leads/${this.LEADS[status]}?${filterPath}`,
    );
  }

  public import(file: File): Observable<SuccessDTO> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.httpClient.post<SuccessDTO>(
      `${environment.api}/leads/import`,
      formData,
    );
  }

  public editLead(id: number, data: EditLeadRequest): Observable<QuoteDTO> {
    return this.httpClient.patch<QuoteDTO>(
      `${environment.api}/leads/${id}`,
      data,
    );
  }

  public delete(ids: number[]): Observable<SuccessDTO> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        ids,
      },
    };

    return this.httpClient.delete<SuccessDTO>(
      `${environment.api}/leads`,
      options,
    );
  }

  public sendEmail(ids: number[]): Observable<SuccessDTO> {
    return this.httpClient.post<SuccessDTO>(
      `${environment.api}/leads/send-email`,
      { ids },
    );
  }
}
