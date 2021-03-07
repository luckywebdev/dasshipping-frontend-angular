import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { GetTripsListResponse } from '../../interfaces/getTripsListResponse';
import {
  GetList,
  GetOrdersListResponse,
  GetTripsRequest,
  LocationTripDTO,
  SuccessDTO,
  TripCreateRequest,
  TripDTO,
  TripEditRequest,
} from '../../interfaces/models';
import { UserService } from '../user/user.service';

@Injectable({ providedIn: 'root' })
export class TripService {
  PATH = {
    1: '',
    2: '/company/me',
    4: '/dispatchers/me',
  };

  constructor(
    protected httpClient: HttpClient,
    private userService: UserService,
  ) { }

  private encodeData(data) {
    return Object.keys(data)
      .filter(key => data[key])
      .map((key) => {
        return [key, data[key]].map(encodeURIComponent).join('=');
      })
      .join('&');
  }

  public getList(filter: GetTripsRequest): Observable<GetTripsListResponse> {
    const filterPath = this.encodeData(filter);
    const { user } = this.userService;
    const path = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.get<GetTripsListResponse>(
      `${environment.api}${path}/trips?${filterPath}`,
    );
  }

  public getOrdersByTrip(
    filter: GetList,
    tripId: number,
  ): Observable<GetOrdersListResponse> {
    const filterPath = this.encodeData(filter);
    const { user } = this.userService;
    const path = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.get<GetOrdersListResponse>(
      `${environment.api}${path}/trips/${tripId}/orders?${filterPath}`,
    );
  }

  public edit(id: number, data: TripEditRequest): Observable<TripDTO> {
    const { user } = this.userService;
    const path = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.patch<TripDTO>(
      `${environment.api}${path}/trips/${id}`,
      data,
    );
  }

  public saveRoute(
    id: number,
    data: { locations: LocationTripDTO[] },
  ): Observable<TripDTO> {
    const { user } = this.userService;
    const path = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.patch<TripDTO>(
      `${environment.api}${path}/trips/${id}/route`,
      data,
    );
  }

  public changeState(
    id: number,
    action: string,
    driverId?: number,
  ): Observable<TripDTO> {
    const { user } = this.userService;
    const path = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.patch<TripDTO>(
      `${environment.api}${path}/trips/${id}/${action}`,
      { driverId },
    );
  }

  public assignOrder(tripId: number, orderId: number): Observable<TripDTO> {
    const { user } = this.userService;
    const path = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.patch<TripDTO>(
      `${environment.api}${path}/trips/${tripId}/assign-order`,
      { orderId },
    );
  }

  public create(data: TripCreateRequest): Observable<TripDTO> {
    const { user } = this.userService;
    const path = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.post<TripDTO>(
      `${environment.api}${path}/trips`,
      data,
    );
  }

  public delete(ids: number[]): Observable<SuccessDTO> {
    const { user } = this.userService;
    const path = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        ids,
      },
    };

    return this.httpClient.delete<SuccessDTO>(
      `${environment.api}${path}/trips`,
      options,
    );
  }

  public get(id: string): Observable<TripDTO> {
    const { user } = this.userService;
    const path = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.get<TripDTO>(
      `${environment.api}${path}/trips/${id}`,
    );
  }

  public removeOrders(
    tripId: number,
    orderIds: number[],
  ): Observable<SuccessDTO> {
    const { user } = this.userService;
    const path = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        orderIds,
      },
    };

    return this.httpClient.delete<SuccessDTO>(
      `${environment.api}${path}/trips/${tripId}/orders`,
      options,
    );
  }
}
