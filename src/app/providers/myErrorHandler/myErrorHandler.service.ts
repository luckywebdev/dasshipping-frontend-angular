import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { ApmErrorHandler } from '@elastic/apm-rum-angular'

import { environment } from '../../../environments/environment';
import { LoadingService } from '../loading/loading.service';

@Injectable()
export class AppErrorhandler implements ErrorHandler {
  constructor(
    protected httpClient: HttpClient,
    private loadingService: LoadingService,
  ) { }

  handleError(err: any): void {
    ApmErrorHandler.apm.captureError(err.originalError || err);
    this.loadingService.stopLoading();
    if (!environment.production) {
      console.log('syntax err:', err);
    } else {
      const message =
        err && err.error && err.error.message
          ? err.error.message
          : JSON.stringify(err);
      this.sendErrorLog(message);
    }
  }

  sendErrorLog(message) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'text',
    };
    const data = {
      message,
      tag: 'web',
      url: window.location.href,
      userAgent: window.navigator.userAgent,
      userLang: window.navigator.language,
      level: 'error',
    };
    return this.httpClient
      .put(environment.logtashUrl, data, {
        ...options.headers,
        responseType: 'text',
      })
      .subscribe((res) => {
        if (!environment.production) {
          console.log(res);
        }
      });
  }
}
