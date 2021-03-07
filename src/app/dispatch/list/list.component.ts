import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { DISPATCH_STATUS } from '../../enums';
import { CarDTO, DispatchDTO, OrderDTO } from '../../interfaces/models';
import { DispatchService } from '../../providers/dispatch/dispatch.service';
import { LoadingService } from '../../providers/loading/loading.service';
import { OrderService } from '../../providers/order/order.service';

interface PeriodicElement {
  id: number;
  companyName: string;
  companyAvatar: string;
  pickDate: string;
  created: string;
  deliveryDate: string;
  status: string;
  age: string;
  action: boolean;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = ['companyName', 'pickDate', 'deliveryDate', 'age', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  id: string;
  loading = false;
  dispatchStatus = DISPATCH_STATUS;
  countDispatch = 0;
  limit = 10;
  skip = 0;
  pageLimit = [5, 10];
  orderDetails: {
    pickAddress: string;
    deliveryAddress: string;
    distance: string;
    cars: CarDTO[];
    trailerType: string;
    pickInformations: string;
    deliveryInformations: string;
    pickDate: string;
    deliveryDate: string;
  };

  constructor(
    private dispatchService: DispatchService,
    private loadingService: LoadingService,
    private orderService: OrderService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loading = true;
    this.getOrder();
    this.getList();
  }

  private createDispatchData(dispatch: DispatchDTO) {
    const duration = moment.duration(moment().diff(dispatch.createdAt));
    const age = `${duration.days() ? `${duration.days()}d` : ''}
${duration.hours() ? `${duration.hours()}h:` : ''}${duration.minutes() ? `${duration.minutes()}m` : ''}`;
    return {
      age: age.trim() ? age : `${duration.seconds()}s`,
      id: dispatch.id,
      companyName: dispatch.company ? dispatch.company.name : '',
      companyAvatar: dispatch.company ? dispatch.company.avatarUrl : '',
      pickDate: this.orderService.toFormatDate(dispatch.pickDate),
      deliveryDate: this.orderService.toFormatDate(dispatch.deliveryDate),
      status: dispatch.status,
      created: this.orderService.toFormatDate(dispatch.createdAt, 'MMM DD, HH:mm A'),
      action: true,
    };
  }

  private getOrder() {
    this.orderService.get(this.id)
      .subscribe(
        (res) => {
          this.setDataDispatch(res);
        },
        () => {
          this.loading = false;
        });
  }

  private getList() {
    this.dispatchService.getList(this.id, { limit: this.limit, offset: this.skip })
      .subscribe((res) => {
        const resp = res.data.map((dispatch: DispatchDTO) => {
          return this.createDispatchData(dispatch);
        });
        this.dataSource.data = resp;
        this.countDispatch = res.count;
        this.loading = false;
      });
  }

  public changePage(event) {
    this.skip = event.pageIndex * this.limit;
    this.limit = event.pageSize;
    this.getList();
  }

  public setDataDispatch(order: OrderDTO) {
    const { pickDate, deliveryDate, pickLocation, deliveryLocation, cars, trailerType, distance } = order;
    this.orderDetails = {
      cars,
      trailerType,
      pickDate: this.orderService.toFormatDate(pickDate),
      deliveryDate: this.orderService.toFormatDate(deliveryDate),
      pickAddress: this.orderService.fullAddress(pickLocation),
      deliveryAddress: this.orderService.fullAddress(deliveryLocation),
      pickInformations: pickLocation.instructions,
      deliveryInformations: deliveryLocation.instructions,
      distance: this.orderService.formatDistance(distance),
    };
  }

  public acceptDispatch(dataDispatch: PeriodicElement) {
    this.loadingService.startLoading();
    this.dispatchService.accept(dataDispatch.id)
      .subscribe(() => {
        this.dataSource.data = this.dataSource.data.map((item) => {
          if (item.id === dataDispatch.id) {
            return {
              ...item, status: DISPATCH_STATUS.ACCEPTED,
            };
          }
          return item;
        });
        this.loadingService.stopLoading();
      });
  }
}
