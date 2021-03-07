import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AddressRequestDTO, CalculateTripRequestDTO, DistanceResponseDTO } from '../../interfaces/models';
import { icon, Marker } from 'leaflet';

const QUERY = '&mode=fastest;truck;traffic:disabled&&height=1&routeattributes=sh,bb,gr';
const QUERY_REVERSE = '&mode=retrieveAll';

@Injectable({ providedIn: 'root' })

export class HereService {
  debouncer: any;

  constructor(protected httpClient: HttpClient) { }

  private encodeData(data) {
    return Object.keys(data).filter(key => data[key]).map((key) => {
      return [key, data[key]].map(encodeURIComponent).join('=');
    }).join('&');
  }

  public getGeocode(search: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.api}/here/geocode?maxresults=5&searchtext=${search}`);
  }

  public getReverseGeocode(search: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.api}/here/reversegeocode?maxresults=1&prox=${search},250${QUERY_REVERSE}`);
  }

  public getRoute(point0: string, point1: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.api}/here/calculateroute?waypoint0=${point0}&waypoint1=${point1}${QUERY}`);
  }

  public validateAddress(body: AddressRequestDTO): Observable<any> {
    return this.httpClient.post<any>(`${environment.api}/here/validate-address`, { ...body, country: 'United States' });
  }

  public calculateRoute(data: CalculateTripRequestDTO): Observable<DistanceResponseDTO> {
    return this.httpClient.post<DistanceResponseDTO>(`${environment.api}/here/calculate-trip`, data);
  }

  public getRouteTrip(query: any): Observable<any> {
    const filter = this.encodeData(query);
    return this.httpClient.get<any>(`${environment.api}/here/calculateroute?${filter}`);
  }

  public setIconsLeaflet() {
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });
    Marker.prototype.options.icon = iconDefault;
  }
}
