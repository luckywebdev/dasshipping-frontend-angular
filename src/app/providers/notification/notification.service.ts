import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { SNACK_BAR } from '../../app.constants';
import { SuccessDTO } from '../../interfaces/models';

@Injectable()
export class NotificationService {
  constructor(
    private snackBar: MatSnackBar,
    private http: HttpClient,
  ) { }

  public success(message: string) {
    this.snackBar.open(message, '', SNACK_BAR.success);
  }

  public error(message: string) {
    this.snackBar.open(message, '', SNACK_BAR.error);
  }

  public markAsViewed(id: number): Observable<SuccessDTO> {
    return this.http.patch<SuccessDTO>(`${environment.api}/notifications/${id}`, {});
  }
}
