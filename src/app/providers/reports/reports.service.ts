import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  DowloadReportsRequestDTO,
  GeneralReportDTO,
  GetReportsByShipperResponse,
  GetReportsByUserResponse,
  OrdersCustomReportFields,
  OrdersCustomReportFilters,
  ReportsByShipperRequestDTO,
  ReportsByUserRequestDTO,
  SuccessDTO,
} from '../../interfaces/models';

@Injectable()
export class ReportsService {

  constructor(private http: HttpClient) { }

  private encodeData(data) {
    return Object.keys(data)
      .filter(key => data[key])
      .map((key) => {
        return [key, data[key]].map(encodeURIComponent).join('=');
      })
      .join('&');
  }

  public getGeneral(): Observable<GeneralReportDTO> {
    return this.http.get<GeneralReportDTO>(`${environment.api}/company/me/reports/general`);
  }

  public getRevenue(filter?: ReportsByShipperRequestDTO): Observable<GetReportsByShipperResponse> {
    const filterPath = this.encodeData(filter);
    return this.http.get<GetReportsByShipperResponse>(`${environment.api}/company/me/reports/shipper?${filterPath}`);
  }

  public getReportsByUser(filter?: ReportsByUserRequestDTO): Observable<GetReportsByUserResponse> {
    const filterPath = this.encodeData(filter);
    return this.http.get<GetReportsByUserResponse>(`${environment.api}/company/me/reports/user?${filterPath}`);
  }

  public dowloadReportsByUser(body: DowloadReportsRequestDTO): Observable<SuccessDTO> {
    return this.http.post<SuccessDTO>(`${environment.api}/company/me/reports/user`, body);
  }

  public sendCustomReport(fieldsToExport: OrdersCustomReportFields, query: OrdersCustomReportFilters): Observable<SuccessDTO> {
    const filterPath = this.encodeData(query);
    return this.http.post<SuccessDTO>(`${environment.api}/company/me/reports/send-custom-report?${filterPath}`, fieldsToExport);
  }
}
