import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource, Sort } from '@angular/material';
import * as moment from 'moment';
import { Observable } from 'rxjs';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { DispatchComponent } from '../../components/dispatch/dispatch.component';
import { DISPATCH_STATUS, ORDER_TABS } from '../../enums';
import { FilterDTO, OrderDTO } from '../../interfaces/models';
import { CompanyService } from '../../providers/company/company.service';
import { LoadingService } from '../../providers/loading/loading.service';
import { OrderService } from '../../providers/order/order.service';

interface PeriodicElement {
  id: number;
  uuid: string;
  cargo: string;
  pickLocation: string;
  deliveryLocation: string;
  trailerType: string;
  request: string;
  requested: string;
  action: boolean;
  distance: string;
}

@Component({
  selector: 'app-order-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @Input() status: string;
  @Input() filter: Observable<FilterDTO>;
  @Output() public changeCount: EventEmitter<number> = new EventEmitter();

  displayedColumns: string[] = ['id', 'pickLocation', 'distance',
    'deliveryLocation', 'cargo', 'trailerType', 'request', 'requested', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatSort, {}) sort: MatSort;
  limit = 10;
  skip = 0;
  pageLimit = [5, 10];
  order: string;
  orderBy: string;
  countOrders = 0;
  loading = false;
  orders: OrderDTO[] = [];
  orderTabs = ORDER_TABS;

  constructor(
    private orderService: OrderService,
    private companyService: CompanyService,
    private loadingService: LoadingService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getList();
    this.subscribeEvents();
  }

  private subscribeEvents() {
    this.filter.subscribe((filter: FilterDTO) => {
      this.getList(filter);
    });
    this.orderService.changeRequested
      .subscribe(() => {
        if (this.status === ORDER_TABS.REQUESTED) {
          this.getList();
        }
      });
  }

  private getList(filters: FilterDTO = {}) {
    this.loading = true;
    this.companyService.getOrders(this.status, {
      ...filters,
      offset: this.skip,
      limit: this.limit,
      orderByField: this.orderBy,
      orderByDirection: this.order,
    })
      .subscribe(
        (res) => {
          this.orders = res.data;
          const resp = res.data.map((order: OrderDTO) => {
            const { shipper } = order;

            return {
              id: order.id,
              uuid: `#${order.uuid}`,
              cargo: order.cars.map((car, index) => `${index + 1}. ${car.year} ${car.make} ${car.model} ${car.type}`).join('<br>'),
              pickLocation: this.orderService.fullAddress(order.pickLocation),
              deliveryLocation: this.orderService.fullAddress(order.deliveryLocation),
              trailerType: order.trailerType,
              requested: moment(order.createdAt).fromNow(),
              request: `Price: ${order.salePrice ? this.orderService.formatPrice(order.salePrice) : ''}$ <br>
              Pick date: ${this.orderService.toFormatDate(order.pickDate)} <br>
              Pick date: ${this.orderService.toFormatDate(order.deliveryDate)}`,
              shipper: shipper && shipper.companyName,
              distance: this.orderService.formatDistance(order.distance),
              action: true,
            };
          });
          this.dataSource.data = resp;
          this.countOrders = res.count;
          this.changeCount.emit(this.countOrders);
          this.loading = false;
        },
        () => {
          this.loading = false;
        });
  }

  public changePage(event) {
    this.skip = event.pageIndex * this.limit;
    this.limit = event.pageSize;
    this.getList();
  }

  public sortData(event: Sort) {
    this.orderBy = event.active;
    this.order = event.direction;
    this.getList();
  }

  private requestDifferent(id: number) {
    const existOrder = this.orders.length ? this.orders.find(item => id === item.id) : false;
    if (existOrder) {
      const dispatch = existOrder.dispatches ? existOrder.dispatches.find(item => item.status === DISPATCH_STATUS.NEW) : null;
      if (dispatch) {
        const options = {
          data: {
            orderId: existOrder.id,
            pickDate: existOrder.pickDate,
            deliveryDate: existOrder.deliveryDate,
            message: 'Request different terms',
            id: dispatch.id,
          },
          width: '450px',
        };
        this.dialog.open(DispatchComponent, options);
      }
    }
  }

  public request(order: PeriodicElement) {
    if (this.status === this.orderTabs.REQUESTED) {
      this.requestDifferent(order.id);
    }
  }

  public cancel(order: PeriodicElement) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm Cancel',
        description: 'Are you sure?',
        nameButton: 'Confirm',
        reason: false,
      },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loadingService.startLoading();
          this.orderService.cancelLoadBoard(order.id)
            .subscribe(() => {
              this.dataSource.data = this.dataSource.data.filter(item => item.id !== order.id);
              this.changeCount.emit(this.countOrders - 1);
              this.orderService.changeRequested.emit();
              this.loadingService.stopLoading();
            });
        }
      });
  }
}
