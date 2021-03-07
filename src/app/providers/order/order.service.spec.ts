import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { Mock_GetOrdersListResponse, Mock_LocationDTO, Mock_OrderDTO } from '../../constants';
import { OrderCreateRequest } from '../../interfaces/models';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;
  const offset = 0;
  const limit = 10;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    service = TestBed.get(OrderService);
    httpMock = TestBed.get(HttpTestingController);
  },
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getList call', () => {
    service.getList()
      .subscribe((resp) => {
        expect(resp).toEqual({
          data: Mock_GetOrdersListResponse.data,
          count: Mock_GetOrdersListResponse.data.length,
        });
      });

    const req = httpMock.expectOne(`${environment.api}/order?offset=${offset}&limit=${limit}`);
    expect(req.request.method).toBe('GET');
    req.flush({
      data: Mock_GetOrdersListResponse.data,
      count: Mock_GetOrdersListResponse.data.length,
    });
  });

  it('should getList with query call', () => {
    service.getList(offset, limit, 'DESC', 'name')
      .subscribe((resp) => {
        expect(resp).toEqual({
          data: Mock_GetOrdersListResponse.data,
          count: Mock_GetOrdersListResponse.data.length,
        });
      });

    const req = httpMock.expectOne(
      `${environment.api}/order?offset=${offset}&limit=${limit}&orderByDirection=DESC&orderByField=name`);
    expect(req.request.method).toBe('GET');
    req.flush({
      data: Mock_GetOrdersListResponse.data,
      count: Mock_GetOrdersListResponse.data.length,
    });
  });

  it('should get call', () => {
    const id = '1';

    service.get(id)
      .subscribe((order) => {
        expect(order).toEqual(Mock_OrderDTO);
      });

    const req = httpMock.expectOne(`${environment.api}/order/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(Mock_OrderDTO);
  });

  it('should create call', () => {
    const body: OrderCreateRequest = {
      startDate: 'new Date()',
      endDate: 'new Date()',
      statusId: 1,
      tripId: 1,
      pickLocation: Mock_LocationDTO,
      deliveryLocation: Mock_LocationDTO,
    };

    service.create(body)
      .subscribe((resp) => {
        expect(resp).toEqual(Mock_OrderDTO);
      });

    const req = httpMock.expectOne(`${environment.api}/order`);
    expect(req.request.method).toBe('POST');
    req.flush(Mock_OrderDTO);
  });

  it('should delete call', () => {
    const id = 1;
    const response = { success: true };
    service.delete(id)
      .subscribe((resp) => {
        expect(resp).toEqual(response);
      });

    const req = httpMock.expectOne(`${environment.api}/order/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(response);
  });
});
