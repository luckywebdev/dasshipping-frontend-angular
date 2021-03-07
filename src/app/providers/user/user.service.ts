import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {ApmService} from '@elastic/apm-rum-angular';
import * as moment from 'moment';
import {Socket} from 'ngx-socket-io';
import {Observable, Subject} from 'rxjs';

import {environment} from '../../../environments/environment';
import {APP_ROUTES, LOCAL_STORAGE} from '../../app.constants';
import {ROLES, WEB_NOTIFICATION} from '../../constants';
import {DeleteAccountsResponse} from '../../interfaces/deleteAccountsResponse';
import {
  AccountDTO,
  ApproveAccountsRequest,
  ApproveAccountsResponse,
  BlockAccountsRequest,
  BlockAccountsResponse,
  DeleteAccountsRequest,
  FileSignResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  GetAccountsListResponse,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SuccessDTO,
  ValidateResetPasswordTokenRequest,
  ValidateResetPasswordTokenResponse,
} from '../../interfaces/models';
import {PatchUserRequest} from '../../interfaces/patchUserRequest';
import {NotificationService} from '../notification/notification.service';
import {ROLES_ENUM} from "../../enums";

@Injectable()
export class UserService implements CanActivate {
  user: AccountDTO;
  toggleSidebar = new Subject<boolean>();
  updateUser = new Subject<AccountDTO>();
  updateOrder = new Subject<boolean>();
  updateCompany = new Subject<boolean>();
  updateUsers = new Subject<boolean>();
  updateQuote = new Subject<boolean>();

  PATH = {
    1: '/account',
    2: '/account',
    4: '/dispatchers/me/drivers',
  };

  PATH_DRIVERS = {
    1: '/account/dispatcher/{dispatcherId}/drivers',
    2: '/company/dispatcher/{dispatcherId}/drivers',
    4: '/dispatchers/me/drivers',
  };

  PATH_ACCOUNT = {
    1: '/account/',
    2: '/company/me/accounts/',
    4: '/dispatchers/me/accounts/',
  };

  PATH_UPDATE = {
    1: '/account/',
    2: '/company/me/accounts/',
    4: '/dispatchers/me/driver/',
  };

  PATH_DRIVERS_LOCATION = {
    2: '/company/me/drivers-location',
    4: '/dispatchers/me/drivers-location',
  };

  constructor(
    private notificationService: NotificationService,
    protected httpClient: HttpClient,
    private router: Router,
    private socket: Socket,
    // @Inject(ApmService) apmService: ApmService,
  ) {
  }

  canActivate(next: ActivatedRouteSnapshot): Promise<boolean> {
    return new Promise((resolve) => {
      if (localStorage.getItem(LOCAL_STORAGE.accessToken) && !this.user) {
        this.getMe()
          .subscribe(
            (res: AccountDTO) => {
              ApmService.apm.setUserContext({
                id: res.id,
                email: res.email,
                username: `${res.firstName} ${res.lastName}`,
              });
              this.user = res;
              if (next.data.roles.includes(this.user.roleId)) {
                this.connectSocket();
                return resolve(true);
              }
              if (this.user.roleId === ROLES_ENUM.SUPER_ADMIN) {
                this.router.navigate([APP_ROUTES.sys_order]);
              } else if (this.user.roleId === ROLES_ENUM.CLIENT || this.user.roleId === ROLES_ENUM.DRIVER) {
                this.notificationService.error(`You are not allowed to access this resource,
                please access the mobile or contact our support at support@cartrasportpro.com`);
                this.removeTokens();
                this.router.navigate([APP_ROUTES.auth]);
              } else {
                this.router.navigate([APP_ROUTES.orders]);
              }
              return resolve(false);
            },
            async (err: HttpErrorResponse) => {
              if (err.error && err.error.statusCode !== 401 && !localStorage.getItem(LOCAL_STORAGE.refreshToken)) {
                this.removeTokens();
                this.router.navigate([APP_ROUTES.auth]);
                return resolve(false);
              }

            });
      } else if (this.user) {
        if (next.data.roles.includes(this.user.roleId)) {
          return resolve(true);
        }
        if (this.user.roleId === ROLES_ENUM.SUPER_ADMIN) {
          this.router.navigate([APP_ROUTES.sys_order]);
        } else if (this.user.roleId === ROLES_ENUM.CLIENT || this.user.roleId === ROLES_ENUM.DRIVER) {
          this.notificationService.error(`You are not allowed to access this resource,
                please access the mobile or contact our support at support@cartrasportpro.com`);
          this.removeTokens();
          this.router.navigate([APP_ROUTES.auth]);
        } else {
          this.router.navigate([APP_ROUTES.orders]);
        }
        return resolve(false);
      } else {
        this.removeTokens();
        this.router.navigate([APP_ROUTES.auth]);
        return resolve(false);
      }
    });
  }

  public connectSocket() {
    this.socket.emit('identity', this.user.id);
    this.socket.on('client-notification', (data) => {
      if (data && data.type === WEB_NOTIFICATION.ORDER) {
        this.updateOrder.next();
        const increment = data.orderId ? 1 : -1;
        this.setUser('notificationOrders', increment);
      }
      if (data && data.type === WEB_NOTIFICATION.CARRIER) {
        this.updateCompany.next();
        this.setUser('notificationCompanies', 1);
      }
      if (data && data.type === WEB_NOTIFICATION.USER) {
        this.updateUsers.next();
        this.setUser('notificationUsers', 1);
      }
      if (data && data.type === WEB_NOTIFICATION.QUOTE) {
        this.updateQuote.next();
        this.setUser('notificationQuotes', 1);
      }
    });
  }

  public setUser(key: string, increment: number) {
    const newCount = this.user[key] + increment;
    this.user[key] = newCount > 0 ? newCount : 0;
    this.updateUser.next(this.user);
  }

  public closeSidebar() {
    this.toggleSidebar.next();
  }

  public async logout() {
    this.removeTokens();
    await this.router.navigateByUrl('/auth');
    this.user = null;
    this.socket.disconnect();
    ApmService.apm.setUserContext({
      username: 'anonymous',
    });
  }

  public getMe(): Observable<AccountDTO> {
    return this.httpClient.get<AccountDTO>(`${environment.api}/account/me`);
  }

  public getById(id: string): Observable<AccountDTO> {
    if (id === 'me') {
      return this.httpClient.get<AccountDTO>(`${environment.api}${this.PATH_ACCOUNT[1]}${id}`);
    }
    const path = this.user && this.user.roleId ? this.PATH_ACCOUNT[this.user.roleId] : this.PATH_ACCOUNT[2];
    return this.httpClient.get<AccountDTO>(`${environment.api}${path}${id}`);
  }

  public getList(
    offset: number = 0,
    limit: number = 10,
    order: string = null,
    orderBy: string = null,
    roleId: number = null): Observable<GetAccountsListResponse> {
    const orderUrl = order ? `&orderByDirection=${order.toLocaleUpperCase()}` : '';
    const orderByUrl = orderBy ? `&orderByField=${orderBy}` : '';
    const roleUrl = roleId ? `&role=${ROLES[roleId]}` : '';
    const path = this.user && this.user.roleId ? this.PATH[this.user.roleId] : this.PATH[2];
    return this.httpClient.get<GetAccountsListResponse>(
      `${environment.api}${path}?offset=${offset}&limit=${limit}${orderUrl}${orderByUrl}${roleUrl}`);
  }

  public getListDrivers(
    dispatcherId: number,
    offset: number = 0,
    limit: number = 10): Observable<GetAccountsListResponse> {
    const path = this.user.roleId ? this.PATH_DRIVERS[this.user.roleId] : this.PATH_DRIVERS[2];
    return this.httpClient.get<GetAccountsListResponse>(
      `${environment.api}${path.replace('{dispatcherId}', dispatcherId)}?offset=${offset}&limit=${limit}`);
  }

  public joinDriverToDispacher(dispatcherId: number, driverId: number) {
    return this.httpClient.post<GetAccountsListResponse>(
      `${environment.api}/company/me/dispatchers/${dispatcherId}/link-driver`, {driverId});
  }

  public unlinkDriverToDispacher(dispatcherId: number, driverId: number) {
    return this.httpClient.post<GetAccountsListResponse>(
      `${environment.api}/account/${dispatcherId}/unlink-driver`, {driverId});
  }

  public unlinkDriver(dispatcherId: number, driverId: number) {
    return this.httpClient.post<GetAccountsListResponse>(
      `${environment.api}/company/me/dispatchers/${dispatcherId}/unlink-driver`, {driverId});
  }

  public leaveCompany(driverId: number) {
    return this.httpClient.post<GetAccountsListResponse>(
      `${environment.api}/company/me/driver/${driverId}/kick-out`, {});
  }

  public setBlock(data: BlockAccountsRequest): Observable<BlockAccountsResponse> {
    return this.httpClient.post<BlockAccountsResponse>(`${environment.api}/account/block`, data);
  }

  public setApprove(data: ApproveAccountsRequest): Observable<ApproveAccountsResponse> {
    return this.httpClient.post<ApproveAccountsResponse>(`${environment.api}/account/approve`, data);
  }

  public delete(data: DeleteAccountsRequest): Observable<DeleteAccountsResponse> {
    return this.httpClient.post<DeleteAccountsResponse>(`${environment.api}/account/delete`, data);
  }

  public userForgotPasswordPost(data: ForgotPasswordRequest): Observable<ForgotPasswordResponse> {
    return this.httpClient.post<ForgotPasswordResponse>(`${environment.api}/account/forgot-password`, data);
  }

  public resetPassword(data: ResetPasswordRequest): Observable<ResetPasswordResponse> {
    return this.httpClient.post<ResetPasswordResponse>(`${environment.api}/account/reset-password`, data);
  }

  public validateRefreshToken(data: RefreshTokenRequest): Observable<RefreshTokenResponse> {
    return this.httpClient.post<RefreshTokenResponse>(`${environment.api}/auth/refresh-token`, data);
  }

  public validateResetPasswordToken(data: ValidateResetPasswordTokenRequest): Observable<ValidateResetPasswordTokenResponse> {
    return this.httpClient.post<ValidateResetPasswordTokenResponse>(`${environment.api}/account/validate-reset-password-token`, data);
  }

  public setTokens(res: LoginResponse, remember: boolean = false) {
    localStorage.setItem(LOCAL_STORAGE.accessToken, res.accessToken);
    if (remember) {
      localStorage.setItem(LOCAL_STORAGE.refreshToken, res.refreshToken);
    }
  }

  public patch(id: string, data: PatchUserRequest): Observable<AccountDTO> {
    const path = this.user && this.user.roleId ? this.PATH_UPDATE[this.user.roleId] : this.PATH_UPDATE[2];
    return this.httpClient.patch<AccountDTO>(`${environment.api}${path}${id}`, data);
  }

  public updateMyProfile(data: PatchUserRequest): Observable<AccountDTO> {
    return this.httpClient.patch<AccountDTO>(`${environment.api}/account/me`, data);
  }

  public getFileSign(filename: string): Observable<FileSignResponse> {
    return this.httpClient.get<FileSignResponse>(`${environment.api}/account/file/${filename}`);
  }

  public removeTokens() {
    localStorage.removeItem(LOCAL_STORAGE.accessToken);
    localStorage.removeItem(LOCAL_STORAGE.refreshToken);
  }

  public toIsoDate(date) {
    let isoDate = date;
    if (!isoDate) {
      return undefined;
    }
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(isoDate)) {
      isoDate = moment(isoDate).format('YYYY-MM-DD');
    }
    return (new Date(isoDate)).toISOString();
  }

  public blockAccount(id: number, blocked = true): Observable<SuccessDTO> {
    const path = this.user && this.user.roleId ? this.PATH_ACCOUNT[this.user.roleId] : this.PATH_ACCOUNT[2];
    return this.httpClient.post<SuccessDTO>(`${environment.api}${path}${id}/block`, {blocked});
  }

  public driversLastLocation(): Observable<AccountDTO[]> {
    const path = this.user && this.user.roleId ? this.PATH_DRIVERS_LOCATION[this.user.roleId] : this.PATH_DRIVERS_LOCATION[2];
    return this.httpClient.get<AccountDTO[]>(`${environment.api}${path}`);
  }
}
