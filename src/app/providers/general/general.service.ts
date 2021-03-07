import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { GeneralDTO, GeneralPatchDTO } from '../../interfaces/models';

@Injectable({ providedIn: 'root' })
export class GeneralService {

  constructor(protected httpClient: HttpClient) { }

  public get(): Observable<GeneralDTO> {
    return this.httpClient.get<GeneralDTO>(`${environment.api}/general`);
  }

  public update(data: GeneralPatchDTO): Observable<GeneralDTO> {
    return this.httpClient.patch<GeneralDTO>(`${environment.api}/general`, data);
  }
}
