import {
  HttpClient,
  HttpErrorResponse,
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
  HttpUserEvent,
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, filter, finalize, switchMap, take} from 'rxjs/operators';
import {v4} from 'uuid';

import {environment} from '../../../environments/environment';
import {LOCAL_STORAGE} from '../../app.constants';
import {LoginResponse} from '../../interfaces/models';
import {LoadingService} from '../loading/loading.service';
import {NotificationService} from '../notification/notification.service';
import {UserService} from '../user/user.service';
import {DISABLE_NOTIFICATION} from './disable-notification.constant';

@Injectable({
  providedIn: 'root',
})

export class InterceptorService implements HttpInterceptor {
  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private loadingService: LoadingService,
    private userService: UserService,
    protected httpClient: HttpClient,
    private notificationService: NotificationService,
  ) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any> | any> {

    return next
      .handle(this.addTokenAndTraceIdToRequest(req, localStorage.getItem(LOCAL_STORAGE.accessToken)))
      .pipe(
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            switch ((<HttpErrorResponse>err).status) {
              case 401:
                this.showError(err);
                if (localStorage.getItem(LOCAL_STORAGE.refreshToken)) {
                  return this.handle401Error(req, next);
                }
                return <any>this.userService.logout();
              case 403:
                this.showError(err);
                return <any>this.userService.logout();
            }
          }
          this.showError(err);
        }),
      );
  }

  private addTokenAndTraceIdToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Trace-Id': v4(),
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.tokenSubject.next(null);

      return this.userService.validateRefreshToken({
        refreshToken: localStorage.getItem(LOCAL_STORAGE.refreshToken),
      })
        .pipe(
          switchMap((user: LoginResponse) => {
            if (user) {
              this.userService.setTokens(user);
              this.tokenSubject.next(user.accessToken);
              return next.handle(this.addTokenAndTraceIdToRequest(request, user.accessToken));
            }
            return <any>this.userService.logout();
          }),
          catchError(() => {
            return <any>this.userService.logout();
          }),
          finalize(() => {
            this.isRefreshingToken = false;
          }),
        );
    }
    this.isRefreshingToken = false;
    return this.tokenSubject
      .pipe(
        filter(token => token != null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addTokenAndTraceIdToRequest(request, token));
        }));
  }

  private showError(err: HttpErrorResponse) {
    const path = err && err.url ? err.url.replace(environment.api, '') : '';
    if (!DISABLE_NOTIFICATION.includes(path) && !path.includes('/car/vin')) {
      const message = err && err.error && err.error.message ? err.error.message : '';
      this.notificationService.error(message);
    }
    this.loadingService.stopLoading();
    return throwError(err);
  }

}
