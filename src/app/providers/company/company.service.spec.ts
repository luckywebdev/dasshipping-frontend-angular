import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { Mock_CompanyDTO, Mock_GetCompanyListResponse } from '../../constants';
import { CompanyService } from './company.service';

describe('CompanyService', () => {
  let service: CompanyService;
  let httpMock: HttpTestingController;
  const offset = 0;
  const limit = 10;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CompanyService, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    service = TestBed.get(CompanyService);
    httpMock = TestBed.get(HttpTestingController);
  },
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getList call', () => {
    service.getList()
      .subscribe((company) => {
        expect(company).toEqual({
          data: Mock_GetCompanyListResponse.data,
          count: Mock_GetCompanyListResponse.data.length,
        });
      });

    const req = httpMock.expectOne(`${environment.api}/company?offset=${offset}&limit=${limit}`);
    expect(req.request.method).toBe('GET');
    req.flush({
      data: Mock_GetCompanyListResponse.data,
      count: Mock_GetCompanyListResponse.data.length,
    });
  });

  it('should getList with query call', () => {
    service.getList(offset, limit, 'DESC', 'name')
      .subscribe((company) => {
        expect(company).toEqual({
          data: Mock_GetCompanyListResponse.data,
          count: Mock_GetCompanyListResponse.data.length,
        });
      });

    const req = httpMock.expectOne(`${environment.api}/company?offset=${offset}&limit=${limit}&orderByDirection=DESC&orderByField=name`);
    expect(req.request.method).toBe('GET');
    req.flush({
      data: Mock_GetCompanyListResponse.data,
      count: Mock_GetCompanyListResponse.data.length,
    });
  });

  it('should get call', () => {
    const id = '1';

    service.get(id)
      .subscribe((company) => {
        expect(company).toEqual(Mock_CompanyDTO);
      });

    const req = httpMock.expectOne(`${environment.api}/company/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(Mock_CompanyDTO);
  });

  it('should update call', () => {
    const id = 1;
    const body = {
      ...Mock_CompanyDTO,
      name: 'Test',
    };

    const resp = {
      ...Mock_CompanyDTO,
      name: 'Test',
    };

    service.update(id, body)
      .subscribe((company) => {
        expect(company).toEqual(resp);
      });

    const req = httpMock.expectOne(`${environment.api}/company/${id}`);
    expect(req.request.method).toBe('PATCH');
    req.flush(resp);
  });

  it('should setBlock call', () => {
    const body = {
      ids: ['1', '2', '3', '4', '5'],
      blocked: true,
      reason: 'Test',
    };

    const resp = {
      success: true,
    };

    service.setBlock(body)
      .subscribe((company) => {
        expect(company).toEqual(resp);
      });

    const req = httpMock.expectOne(`${environment.api}/company/block`);
    expect(req.request.method).toBe('POST');
    req.flush(resp);
  });
});
