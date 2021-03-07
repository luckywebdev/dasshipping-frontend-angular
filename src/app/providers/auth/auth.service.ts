import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../../interfaces/models';

@Injectable()
export class AuthService {
  constructor(protected httpClient: HttpClient) { }

  public authLoginPost(data: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${environment.api}/auth/login`, data);
  }
}
