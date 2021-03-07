import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { Mock_GetTripsListResponse, Mock_SuccessDTO, Mock_TripDTO } from '../../constants';
import { TripService } from './trip.service';

describe('TripService', () => {
  let service: TripService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TripService, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    service = TestBed.get(TripService);
    httpMock = TestBed.get(HttpTestingController);
  },
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getList call', () => {
    service.getList()
      .subscribe((resp) => {
        expect(resp).toEqual(Mock_GetTripsListResponse);
      });

    const req = httpMock.expectOne(`${environment.api}/trip?offset=0&limit=10`);
    expect(req.request.method).toBe('GET');
    req.flush(Mock_GetTripsListResponse);
  });

  it('should get call', () => {
    const body = {
      driverId: 1,
      notes: 'string',
      statusId: 1,
    };

    service.create(body)
      .subscribe((resp) => {
        expect(resp).toEqual(Mock_TripDTO);
      });

    const req = httpMock.expectOne(`${environment.api}/trip`);
    expect(req.request.method).toBe('POST');
    req.flush(Mock_TripDTO);
  });

  it('should create call', () => {
    const id = 1;

    service.draft(id)
      .subscribe((resp) => {
        expect(resp).toEqual(Mock_SuccessDTO);
      });

    const req = httpMock.expectOne(`${environment.api}/trip/draft/order/${id}`);
    expect(req.request.method).toBe('POST');
    req.flush(Mock_SuccessDTO);
  });

  it('should delete call', () => {
    const id = '1';
    service.delete(id)
      .subscribe((resp) => {
        expect(resp).toEqual(Mock_SuccessDTO);
      });

    const req = httpMock.expectOne(`${environment.api}/trip/draft/order/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(Mock_SuccessDTO);
  });
});
