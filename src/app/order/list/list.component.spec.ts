import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDatepickerModule,
  MatDialogModule,
  MatDialogRef,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { Observable, Observer } from 'rxjs';

import { APP_ROUTES } from '../../app.constants';
import { Mock_GetOrdersListResponse } from '../../constants';
import { DirectivesModule } from '../../directives.module';
import { GetOrdersListResponse } from '../../interfaces/models';
import { OrderService } from '../../providers/order/order.service';
import { OrderComponent } from '../order/order.component';
import { ListComponent } from './list.component';

describe('ListComponent', () => {
  let component: ListComponent;
  let orderService: OrderService;
  let fixture: ComponentFixture<ListComponent>;

  const dataSource: any = Mock_GetOrdersListResponse.data.map((order) => {
    return {
      id: order.id,
      company: order.company.name,
      pickAddress: order.pickLocation,
      deliveryAddress: order.deliveryLocation,
      startDate: order.startDate,
      endDate: order.endDate,
      status: order.status.name,
    };
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListComponent, OrderComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        BrowserModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes(
          [{ path: `${APP_ROUTES.order}/:id`, component: OrderComponent }],
        ),
        HttpClientTestingModule,
        MatDialogModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        DirectivesModule,
        LeafletModule,
        MatIconModule,
      ],
      providers: [
        HttpClientTestingModule,
        OrderService,
        { provide: MatDialogRef, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    orderService = fixture.debugElement.injector.get(
      OrderService,
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call goOrder', () => {
    component.goOrder(dataSource[0]);
    expect(component.goOrder).toBeTruthy();
  });

  it('should call getList', () => {
    spyOn(orderService, 'getList').and.returnValue(
      new Observable((observer: Observer<GetOrdersListResponse>) => {
        return observer.next({
          data: Mock_GetOrdersListResponse.data,
          count: Mock_GetOrdersListResponse.data.length,
        });
      }),
    );

    component['getList']();
    fixture.detectChanges();
    expect(orderService.getList).toHaveBeenCalled();
  });

  it('should call getList error', () => {
    spyOn(orderService, 'getList').and.returnValue(
      new Observable((observer: Observer<any>) => {
        return observer.error('error');
      }),
    );

    component['getList']();
    fixture.detectChanges();
    expect(orderService.getList).toHaveBeenCalled();
  });

  it('should call changePage', () => {
    component.changePage({
      pageIndex: 0,
      previousPageIndex: 0,
      pageSize: 1,
      length: 2,
    });
    expect(component.changePage).toBeTruthy();
  });

  it('should call sortData', () => {
    component.sortData({
      active: 'name',
      direction: 'desc',
    });
    expect(component.sortData).toBeTruthy();
  });

  afterAll(() => {
    component.loading = false;
    fixture.detectChanges();
    const elements = document.body.getElementsByClassName('.cdk-overlay-container');
    while (elements.length > 0) {
      elements[0].remove();
    }
    fixture.destroy();
  });
});
