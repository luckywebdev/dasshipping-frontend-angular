import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { FileUploadResponse } from '../../interfaces/fileUploadResponse';

@Injectable()
export class FileService {

  constructor(protected http: HttpClient) { }

  public upload(file: File): Observable<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<FileUploadResponse>(`${environment.api}/file/upload`, formData);
  }
}
