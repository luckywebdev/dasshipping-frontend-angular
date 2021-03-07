import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';

import { APP_ROUTES } from '../../app.constants';
import { AddTripComponent } from '../../components/add-trip/add-trip.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { CreateTripComponent } from '../../components/create-trip/create-trip.component';
import { PATH_ORDERS_TAB } from '../../constants';
import { NEW_ORDER_STATUS, ORDER_STATUS, ROLES_STATUS } from '../../enums';
import { OrderDTO, TripDTO } from '../../interfaces/models';
import { CompanyService } from '../../providers/company/company.service';
import { LoadingService } from '../../providers/loading/loading.service';
import { NotificationService } from '../../providers/notification/notification.service';
import { OrderService } from '../../providers/order/order.service';
import { UserService } from '../../providers/user/user.service';

interface PeriodicElement {
  id: number;
  uuid: string;
  pick: string;
  delivery: string;
  shipper: string;
  trailerType: string;
  cargo: string;
  distance: string;
  status: string;
  price: string;
  dispatcher: string;
  companyId: number;
  dispatcherId: number;
  driverId: number;
  driver: string;
  tripId: number;
  viewStatus: string;
  action: boolean;
  invoiceDueDate: string;
  existNotify?: boolean;
  notifyIds: number[];
}

@Component({
  selector: 'app-list-load',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  @Input() filter: Observable<any>;
  @Input() path: string;
  @Output() public changeCount: EventEmitter<number> = new EventEmitter();
  displayedColumns: string[] = [
    'pick',
    'delivery',
    'shipper',
    'trailerType',
    'cargo',
    'action',
  ];
  dataSource = new MatTableDataSource<PeriodicElement>();
  limit = 10;
  skip = 0;
  pageLimit = [5, 10];
  countOrders = 0;
  loading = false;
  pathOrdersTab = PATH_ORDERS_TAB;
  orderStatuses = ORDER_STATUS;
  orderSubscription: Subscription;

  constructor(
    private companyService: CompanyService,
    public dialog: MatDialog,
    private orderService: OrderService,
    private loadingService: LoadingService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.subscribeEvents();
    this.route.queryParams.subscribe((params) => {
      if (params && params['name']) {
        this.getOrders({ shipperCompanyName: params['name'] });
      } else {
        this.getOrders();
      }
    });
    this.orderSubscription = this.userService
      .updateOrder
      .subscribe(() => {
        this.getOrders();
      });
  }

  ngOnDestroy() {
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
  }

  private subscribeEvents() {
    this.filter.subscribe((filter) => {
      this.loading = true;
      this.getOrders(filter);
    });

    this.orderService.changeRequested.subscribe(() => {
      this.loading = true;
      this.getOrders();
    });
  }

  private setData(order: OrderDTO) {
    const {
      cars,
      pickLocation,
      pickDate,
      deliveryLocation,
      deliveryDate,
      id,
      uuid,
      distance,
      salePrice,
      status,
      trailerType,
      companyId,
      invoiceDueDate,
      shipper,
      notifications,
    } = order;
    let trip = null;
    let tripId = null;
    const [orderTrip] = order.orderTrips;
    if (orderTrip) {
      trip = orderTrip.trip;
      tripId = orderTrip.tripId;
    }

    return {
      id,
      trailerType,
      status,
      tripId,
      companyId,
      uuid: `#${uuid}`,
      viewStatus: status === ORDER_STATUS.CANCELED ? 'Canceled by Client' : this.orderService.formatStatus(status).toUpperCase(),
      pick: `${this.orderService.fullAddress(pickLocation)} <br>
      ${
        pickLocation && pickLocation.addressType ? `<span>${pickLocation.addressType}</span>` : ''
        } <span class="${this.lateDate(order, 'pickDate') ? 'late_date' : ''}">${this.orderService.toFormatDate(pickDate)}</span>`,
      delivery: `${this.orderService.fullAddress(deliveryLocation)} <br>
      ${
        deliveryLocation && deliveryLocation.addressType
          ? `<span>${deliveryLocation.addressType}</span>`
          : ''
        } <span class="${this.lateDate(order, 'deliveryDate') ? 'late_date' : ''}">${this.orderService.toFormatDate(deliveryDate)}</span>`,
      cargo: cars
        .map(
          (car, index) =>
            `${index + 1}. ${car.year} ${car.make} ${car.model} ${car.type}`,
        )
        .join('<br>'),
      shipper: shipper && shipper.companyName,
      distance: distance ? this.orderService.formatDistance(distance) : '',
      price: salePrice ? this.orderService.formatPrice(salePrice) : '',
      dispatcher: this.getFullNameDispatcher(trip),
      dispatcherId: order.dispatcherId || (trip && trip.dispatcherId),
      driverId: tripId ? trip.driverId : order.driverId,
      driver: this.getFullNameDriver(trip),
      action: true,
      invoiceDueDate: invoiceDueDate
        ? this.orderService.toFormatDate(invoiceDueDate)
        : '',
      existNotify: !!(notifications && notifications.length),
      notifyIds: notifications && notifications.length ? notifications.map(item => item.id) : [],
    };
  }

  private lateDate(order: OrderDTO, key: string) {
    const { status } = order;
    if ([PATH_ORDERS_TAB.NEW_LOADS, PATH_ORDERS_TAB.ASSIGNED].includes(this.path) &&
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

  private getFullNameDriver(trip: TripDTO) {
    const nameFromTrip =
      trip && trip.driverId
        ? `${trip.driver.firstName} ${trip.driver.lastName}`
        : null;
    return nameFromTrip;
  }

  private getFullNameDispatcher(trip: TripDTO) {
    const nameFromTrip =
      trip && trip.dispatcherId
        ? `${trip.dispatcher.firstName} ${trip.dispatcher.lastName}`
        : null;
    return nameFromTrip;
  }

  private getOrders(filter: any = {}) {
    this.companyService
      .getOrdersMe(
        { ...filter, limit: this.limit, offset: this.skip },
        this.path,
      )
      .subscribe(
        (res) => {
          const data = res.data.map(order => this.setData(order));
          this.dataSource.data = data;
          this.countOrders = res.count;
          this.changeCount.emit(this.countOrders);
          this.loading = false;
        },
        () => {
          this.loading = false;
        },
      );
  }

  public changePage(event) {
    this.skip = event.pageIndex * this.limit;
    this.limit = event.pageSize;
    this.getOrders();
  }

  public addTrip(order: PeriodicElement) {
    const dialogRef = this.dialog.open(AddTripComponent, {
      data: {
        orderId: order.id,
        tripId: order.tripId,
      },
      width: '450px',
      minHeight: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateList(order, result);
      }
    });
  }

  private updateList(order: PeriodicElement, result: any) {
    if (order.status === NEW_ORDER_STATUS.DECLINED) {
      this.dataSource.data = this.dataSource.data.filter(
        item => item.id !== order.id,
      );
      this.orderService.changeRequested.emit();
    } else {
      this.dataSource.data = this.dataSource.data.map((item) => {
        if (order.id === item.id) {
          let trip = null;
          let tripId = null;
          const [orderTrip] = result.orderTrips;
          if (orderTrip) {
            trip = orderTrip.trip;
            tripId = orderTrip.tripId;
          }
          return {
            ...item,
            tripId,
            driver: this.getFullNameDriver(trip),
            dispatcher: this.getFullNameDispatcher(trip),
          };
        }
        return item;
      });
    }
    if (this.path === PATH_ORDERS_TAB.NEW_LOADS) {
      this.orderService.changeRequested.emit();
    }
  }

  public createTrip(order: PeriodicElement) {
    const { tripId, driverId, dispatcherId } = order;
    let data: any = { orderIds: [order.id] };
    if (tripId) {
      data = {
        ...data,
        driverId,
        dispatcherId,
        id: tripId,
      };
    }
    const dialogRef = this.dialog.open(CreateTripComponent, {
      data,
      width: '450px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = this.dataSource.data.map((item) => {
          if (order.id === item.id) {
            return {
              ...item,
              tripId: result.id,
              driver: this.getFullNameDriver(result),
              dispatcher: this.getFullNameDispatcher(result),
              dispatcherId:
                result && result.dispatcherId ? result.dispatcherId : null,
              driverId: result && result.driverId ? result.driverId : null,
            };
          }
          return item;
        });
        if (this.path === PATH_ORDERS_TAB.NEW_LOADS) {
          this.orderService.changeRequested.emit();
        }
      }
    });
  }

  public cancelOrder(order: PeriodicElement) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm Cancel',
        description: 'Are you sure?',
        nameButton: 'Confirm',
        reason: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadingService.startLoading();
        this.orderService.cancleOrder(order.id).subscribe(() => {
          this.dataSource.data = this.dataSource.data.filter(
            item => item.id !== order.id,
          );
          this.changeCount.emit(this.countOrders - 1);
          this.loadingService.stopLoading();
        });
      }
    });
  }

  public checkPermissonTrip(status) {
    return ![ORDER_STATUS.CANCELED].includes(status);
  }

  public async goOrder(element: PeriodicElement) {
    const { user } = this.userService;
    if (element.notifyIds.length) {
      element.notifyIds.forEach((notifyId) => {
        this.notificationService.markAsViewed(notifyId)
          .subscribe(() => {
            this.userService.setUser('notificationOrders', -1);
          });
      });
      this.dataSource.data = this.dataSource.data.map((item) => {
        if (item.id === element.id) {
          return {
            ...item,
            existNotify: false,
            notifyIds: [],
          };
        }
        return item;
      });
    }
    if (element.status === ORDER_STATUS.CANCELED) {
      return;
    }
    this.loadingService.startLoading();
    if (
      ((user.id === element.dispatcherId && user.roleId === ROLES_STATUS.DISPATCHER) ||
        user.roleId === ROLES_STATUS.COMPANY_ADMIN) &&
      user.companyId === element.companyId
    ) {
      await this.router.navigate([APP_ROUTES.order, element.id]);
      this.loadingService.stopLoading();
    } else {
      this.notificationService.success(
        'This order is not still assigned to you',
      );
      this.loadingService.stopLoading();
    }
  }

  public markRead(element: PeriodicElement) {
    if (element.notifyIds.length) {
      element.notifyIds.forEach((notifyId) => {
        this.notificationService.markAsViewed(notifyId)
          .subscribe(() => {
            this.userService.setUser('notificationOrders', -1);
          });
      });
      this.dataSource.data = this.dataSource.data.map((item) => {
        if (item.id === element.id) {
          return {
            ...item,
            existNotify: false,
            notifyIds: [],
          };
        }
        return item;
      });
    }
  }

  public checkDelete(order: PeriodicElement) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm delete',
        description: 'Are you sure?',
        nameButton: 'Delete',
        reason: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadingService.startLoading();
        this.orderService.deleteOrder(order.id).subscribe(() => {
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
