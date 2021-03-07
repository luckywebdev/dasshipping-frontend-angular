import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';

import {environment} from '../../../environments/environment';
import {
  CarDTO,
  RequestTrailerDTO,
  RequestTruckDTO,
  TrailerDTO,
  TruckDTO,
} from '../../interfaces/models';
import {CarEditDTO} from '../../interfaces/carEditDTO';

@Injectable({providedIn: 'root'})
export class CarService {
  constructor(protected httpClient: HttpClient) {}

  public get(vin: string): Observable<CarDTO> {
    return this.httpClient.get<CarDTO>(`${environment.api}/car/vin/${vin}`);
  }

  public getTrack(id: string): Observable<TruckDTO> {
    return this.httpClient.get<TruckDTO>(`${environment.api}/truck/${id}`);
  }

  public getCarsDriever(id: string): Observable<any> {
    const requests = [
      this.httpClient.get(`${environment.api}/truck/${id}`),
      this.httpClient.get(`${environment.api}/trailer/${id}`),
    ];
    return forkJoin(requests);
  }

  public setTrack(id: number, data: RequestTruckDTO): Observable<TruckDTO> {
    return this.httpClient.put<TruckDTO>(
      `${environment.api}/truck/${id}`,
      data
    );
  }

  public createTrack(data: RequestTruckDTO): Observable<TruckDTO> {
    return this.httpClient.post<TruckDTO>(`${environment.api}/truck`, data);
  }

  public setTrailer(
    id: number,
    data: RequestTrailerDTO
  ): Observable<TrailerDTO> {
    return this.httpClient.put<TrailerDTO>(
      `${environment.api}/trailer/${id}`,
      data
    );
  }

  public createTrailer(data: RequestTrailerDTO): Observable<TrailerDTO> {
    return this.httpClient.post<TrailerDTO>(`${environment.api}/trailer`, data);
  }

  public editCar(id: number, data: CarEditDTO): Observable<CarDTO> {
    return this.httpClient.patch<CarDTO>(`${environment.api}/car/${id}`, data);
  }
}
