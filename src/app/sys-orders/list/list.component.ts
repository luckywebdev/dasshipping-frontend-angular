import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource, Sort } from '@angular/material';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

import { APP_ROUTES } from '../../app.constants';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { CLIENT_PAYMENT_STATUSES } from '../../constants';
import { ORDER_STATUS, ORDER_TABS } from '../../enums';
import { OrderDTO } from '../../interfaces/models';
import { LoadingService } from '../../providers/loading/loading.service';
import { NotificationService } from '../../providers/notification/notification.service';
import { OrderService } from '../../providers/order/order.service';
import { UserService } from '../../providers/user/user.service';

interface PeriodicElement {
  id: number;
  uuid: string;
  cargo: string;
  pickLocation: string;
  deliveryLocation: string;
  shipper: string;
  trailerType: string;
  pickDate: string;
  deliveryDate: string;
  action: boolean;
  distance: string;
  age: string;
  status: string;
  profit: string;
  dispatchesLength: number;
  perMile: string;
  price: string;
  salePrice: string;
  published: boolean;
  companyId?: number;
  companyAvatar?: string;
  companyContact?: string;
  existNotify?: boolean;
  notifyIds: number[];
  latePickUp: boolean;
  lateDelivery: boolean;
  paymentStatus: string;
  paymentStatusSucces: boolean;
  originalStatus: string;
}

@Component({
  selector: 'app-order-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  @Input() status: string;
  @Output() public changeCount: EventEmitter<number> = new EventEmitter();

  orderTabs = ORDER_TABS;
  orderStatuses = ORDER_STATUS;
  displayedColumns: string[] = [
    'id',
    'pickLocation',
    'distance',
    'deliveryLocation',
    'cargo',
    'shipper',
    'trailerType',
    'pickDate',
    'age',
    'action',
    'company',
  ];
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
  orderSubscription: Subscription;

  constructor(
    private orderService: OrderService,
    private loadingService: LoadingService,
    public dialog: MatDialog,
    private router: Router,
    private notificationService: NotificationService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.getList();
    this.orderSubscription = this.userService
      .updateOrder
      .subscribe(() => {
        this.getList(false);
      });
  }

  ngOnDestroy() {
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
  }

  private setOrder(order: OrderDTO) {
    let { company } = order;
    const { invite, shipper, notifications, clientPaymentStatus } = order;
    if (this.status === ORDER_TABS.EXPIRED && invite && invite.length) {
      const invitation = invite[0];
      company = invitation.company;
    }

    return {
      id: order.id,
      uuid: order.uuid,
      cargo: order.cars
        .map(
          (car, index) =>
            `${index + 1}. ${car.year} ${car.make} ${car.model} ${car.type}`,
        )
        .join('<br>'),
      pickLocation: this.orderService.fullAddress(order.pickLocation, true),
      deliveryLocation: this.orderService.fullAddress(
        order.deliveryLocation,
        true,
      ),
      trailerType: order.trailerType,
      pickDate: this.orderService.toFormatDate(order.pickDate),
      deliveryDate: this.orderService.toFormatDate(order.deliveryDate),
      age:
        this.status === ORDER_TABS.DISPATCHED
          ? this.orderService.toFormatDate(order.createdAt)
          : moment(order.createdAt).fromNow(),
      distance: this.orderService.formatDistance(order.distance),
      shipper: shipper && shipper.companyName,
      profit: this.orderService.formatPrice(
        (order.loadPrice || order.priceWithDiscount) - order.salePrice,
      ),
      perMile: this.orderService.formatDistance(
        (order.loadPrice || order.priceWithDiscount) / order.distance,
      ),
      dispatchesLength: order.dispatches ? order.dispatches.length : 0,
      price: this.orderService.formatPrice(order.priceWithDiscount),
      salePrice: this.orderService.formatPrice(order.salePrice),
      status: this.orderService.formatStatus(order.status).toUpperCase(),
      published: order.published,
      action: true,
      companyId: company ? company.id : null,
      companyAvatar: company && company.avatarUrl ? company.avatarUrl : null,
      companyContact: company ? company.name : '',
      existNotify: !!(notifications && notifications.length),
      notifyIds: notifications && notifications.length ? notifications.map(item => item.id) : [],
      latePickUp: this.lateDate(order, 'pickDate'),
      lateDelivery: this.lateDate(order, 'deliveryDate'),
      paymentStatus: this.orderService.formatStatusPayment(clientPaymentStatus),
      paymentStatusSucces:
        [CLIENT_PAYMENT_STATUSES.CAR_PICKUP_PAID, CLIENT_PAYMENT_STATUSES.SERVICE_FEE_PAID].includes(clientPaymentStatus),
      originalStatus: order.status,
    };
  }

  private lateDate(order: OrderDTO, key: string) {
    const { status } = order;
    if (this.status === ORDER_TABS.ASSIGNED &&
      ![
        ORDER_STATUS.DECLINED.toString(),
        ORDER_STATUS.CLAIMED.toString(),
        ORDER_STATUS.DELIVERED.toString(),
        ORDER_STATUS.ARCHIVED.toString(),
        ORDER_STATUS.CANCELED.toString(),
        ORDER_STATUS.BILLED.toString(),
        ORDER_STATUS.PAID.toString(),
        ORDER_STATUS.DELETED.toString()].includes(status)) {
      const date = order[key] && moment(order[key]).unix();
      return date && date < moment().unix();
    }
    return false;
  }

  public goCompany(companyId) {
    if (companyId) {
      this.router.navigateByUrl(`${APP_ROUTES.company}/${companyId}`);
    }
  }

  private getList(loading = true) {
    this.loading = loading;
    this.orderService
      .getListOrders(this.status, {
        offset: this.skip,
        limit: this.limit,
        orderByField: this.orderBy,
        orderByDirection: this.order,
      })
      .subscribe(
        (res) => {
          this.orders = res.data;
          const resp = res.data.map((order: OrderDTO) => {
            return this.setOrder(order);
          });
          this.dataSource.data = resp;
          this.countOrders = res.count;
          this.changeCount.emit(this.countOrders);
          this.loading = false;
        },
        () => {
          this.loading = false;
        },
      );
  }

  public goOrder(row: PeriodicElement) {
    if (row && row.id) {
      if (row.notifyIds.length) {
        row.notifyIds.forEach((item) => {
          this.notificationService.markAsViewed(item)
            .subscribe(() => {
              this.userService.setUser('notificationOrders', -1);
            });
        });
      }
      if (row.originalStatus === ORDER_STATUS.CANCELED) {
        return;
      }
      this.router.navigateByUrl(`${APP_ROUTES.order}/${row.id}`);
    }
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

  public updatePublish(order: PeriodicElement, status: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm',
        description: 'Are you sure?',
        nameButton: status,
        reason: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.orderService.publish(order.id, status).subscribe((res) => {
          this.dataSource.data = this.dataSource.data.map((item) => {
            if (item.id === res.id) {
              return this.setOrder(res);
            }
            return item;
          });
        });
      }
    });
  }

  public view(order: PeriodicElement) {
    this.router.navigate([APP_ROUTES.dispatch, order.id]);
  }

  public checkDelete(order: PeriodicElement) {
    let message = 'This order is already removed form company board, so you can safe remove it';
    if (order.companyId) {
      message = `This order is still present on company board, after removal, this order wil disappear from company board without any notifications. Do you confirm this action`;
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm delete',
        description: message,
        nameButton: 'Delete',
        reason: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadingService.startLoading();
        this.orderService.delete(order.id).subscribe(() => {
          this.dataSource.data = this.dataSource.data.filter(
            item => item.id !== order.id,
          );
          this.changeCount.emit(this.countOrders - 1);
          this.loadingService.stopLoading();
        });
      }
    });
  }
}
