import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatSort, MatTableDataSource, Sort } from '@angular/material';
import { Router } from '@angular/router';

import { APP_ROUTES } from '../../app.constants';
import { AssignToTripComponent } from '../../components/assign-trip/assign-trip.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { REGEX_URL, TRIP_STATUSES } from '../../constants';
import { ROLES_STATUS, TRIP_STATUS } from '../../enums';
import { GetTripsListResponse } from '../../interfaces/getTripsListResponse';
import { AccountDTO, LocationDTO, TripDTO } from '../../interfaces/models';
import { LoadingService } from '../../providers/loading/loading.service';
import { OrderService } from '../../providers/order/order.service';
import { TripService } from '../../providers/trip/trip.service';
import { UserService } from '../../providers/user/user.service';

interface PeriodicElement {
  id: number;
  pickInformation: string;
  distance: string;
  deliveryInformation: string;
  dispatcher: string;
  driver: string;
  status: string;
  driverAvatar: string;
  dispatcherAvatar: string;
  driverId: number;
  dispatcherId: number;
  price: string;
  actors: boolean;
}

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = [
    "select",
    "id",
    "pickInformation",
    "distance",
    "deliveryInformation",
    "actors",
    "action"
  ];
  dataSource = new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);
  @ViewChild(MatSort, {}) sort: MatSort;
  limit = 10;
  skip = 0;
  pageLimit = [5, 10];
  order: string;
  orderBy: string;
  countTrips = 0;
  loading = false;
  tripStatus = TRIP_STATUS;
  tripStatuses = TRIP_STATUSES;
  drivers: AccountDTO[] = [];
  dispatchers: AccountDTO[] = [];
  skipDriver = 0;
  countDriver = 0;
  skipDispatcher = 0;
  countDispatcher = 0;
  roles = ROLES_STATUS;

  constructor(
    private tripService: TripService,
    private loadingService: LoadingService,
    private orderService: OrderService,
    public userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) { }

  public filter = this.fb.group({
    id: new FormControl(""),
    driverId: new FormControl(undefined),
    dispatcherId: new FormControl(undefined),
    status: new FormControl("")
  });

  ngOnInit() {
    this.getList();
    this.getDrivers();
    const { user } = this.userService;
    if (user.roleId !== ROLES_STATUS.DISPATCHER) {
      this.getDispatchers();
    }
  }

  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  public isDispetcher() {
    const { user } = this.userService;
    return user && user.roleId === ROLES_STATUS.DISPATCHER;
  }

  public masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  public checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row.id
      }`;
  }

  private getList(filter = {}) {
    this.loading = true;
    this.tripService
      .getList({
        ...filter,
        offset: this.skip,
        limit: this.limit,
        orderByDirection: this.order ? this.order.toUpperCase() : "",
        orderByField: this.orderBy
      })
      .subscribe(
        res => {
          this.setInitialData(res);
        },
        () => {
          this.loading = false;
        }
      );
  }

  private setInformation(information: LocationDTO) {
    if (!information) {
      return "";
    }
    return `${information.city}, ${information.state} ${
      information.zipCode
      }<br> ${
      information && information.addressType ? information.addressType + "<br>" : ""
      } ${this.orderService.toFormatDate(information.updatedAt, "DD-MM-YYYY")}`;
  }

  private checkUrl(url: string) {
    return !!REGEX_URL.test(url);
  }

  private setTrip(trip: TripDTO) {
    return {
      id: trip.id,
      pickInformation: this.setInformation(trip.pickLocation),
      deliveryInformation: this.setInformation(trip.deliveryLocation),
      distance: this.orderService.formatDistance(trip.distance),
      driver: trip.driver
        ? `${trip.driver.firstName} ${trip.driver.lastName}`
        : null,
      dispatcher: trip.dispatcher
        ? `${trip.dispatcher.firstName} ${trip.dispatcher.lastName}`
        : null,
      driverAvatar:
        trip.driver && this.checkUrl(trip.driver.avatarUrl)
          ? trip.driver.avatarUrl
          : null,
      dispatcherAvatar:
        trip.dispatcher && this.checkUrl(trip.dispatcher.avatarUrl)
          ? trip.dispatcher.avatarUrl
          : null,
      driverId: trip.driver ? trip.driver.id : null,
      dispatcherId: trip.dispatcher ? trip.dispatcher.id : null,
      status: this.orderService.formatStatus(trip.status).toUpperCase(),
      statusOriginal: trip.status,
      actors: true,
      price: this.orderService.formatPrice(trip.totalPrice)
    };
  }

  private setInitialData(res: GetTripsListResponse) {
    const resp = res.data.map((trip: TripDTO) => {
      return this.setTrip(trip);
    });
    this.dataSource.data = resp;
    this.countTrips = res.count;
    this.loading = false;
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

  public checkRemoveTrips() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "450px",
      data: {
        action: "Confirm Remove",
        description: "Are you sure?",
        nameButton: "Confirm",
        reason: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.selection.clear();
      }
      if (result) {
        this.loadingService.startLoading();
        const deleteTrips = this.selection.selected.map(user => user.id);
        this.tripService.delete(deleteTrips).subscribe(() => {
          this.loadingService.stopLoading();
          this.selection.clear();
          this.getList();
        });
      }
    });
  }

  public assaignDispatcher(trip: PeriodicElement) {
    const { id, dispatcherId } = trip;
    const data = {
      id,
      accountId: dispatcherId,
      role: ROLES_STATUS.DISPATCHER
    };
    this.openModalAssign(data);
  }

  public assaignDriver(trip: PeriodicElement) {
    const { id, driverId } = trip;
    const data = {
      id,
      accountId: driverId,
      role: ROLES_STATUS.DRIVER
    };
    this.openModalAssign(data);
  }

  private openModalAssign(data: {
    id: number;
    accountId: number;
    role: number;
  }) {
    const dialogRef = this.dialog.open(AssignToTripComponent, {
      data,
      width: "450px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadingService.startLoading();
        this.dataSource.data = this.dataSource.data.map(item => {
          if (data.id === item.id) {
            return {
              ...item,
              driver: result.driver
                ? `${result.driver.firstName} ${result.driver.lastName}`
                : null,
              dispatcher: result.dispatcher
                ? `${result.dispatcher.firstName} ${result.dispatcher.lastName}`
                : null,
              driverAvatar:
                result.driver && this.checkUrl(result.driver.avatarUrl)
                  ? result.driver.avatarUrl
                  : null,
              dispatcherAvatar:
                result.dispatcher && this.checkUrl(result.dispatcher.avatarUrl)
                  ? result.dispatcher.avatarUrl
                  : null,
              driverId: result.driver ? result.driver.id : null,
              dispatcherId: result.dispatcher ? result.dispatcher.id : null
            };
          }
          return item;
        });
        this.loadingService.stopLoading();
      }
    });
  }

  private getDrivers() {
    this.userService
      .getList(this.skipDriver, this.limit, null, null, ROLES_STATUS.DRIVER)
      .subscribe(res => {
        const drivers = res.data;
        this.drivers = [...this.drivers, ...drivers];
        this.countDriver = res.count;
      });
  }

  public getListDrivers() {
    if (this.drivers.length < this.countDriver) {
      this.skipDriver = this.skipDriver + this.limit;
      this.getDrivers();
    }
  }

  private getDispatchers() {
    this.userService
      .getList(
        this.skipDispatcher,
        this.limit,
        null,
        null,
        ROLES_STATUS.DISPATCHER
      )
      .subscribe(res => {
        const dispatchers = res.data;
        this.dispatchers = [...this.dispatchers, ...dispatchers];
        this.countDriver = res.count;
      });
  }

  public getListDispatchers() {
    if (this.dispatchers.length < this.countDispatcher) {
      this.skipDispatcher = this.skipDispatcher + this.limit;
      this.getDispatchers();
    }
  }

  public search() {
    this.getList(this.filter.value);
  }

  public goTrip(trip: PeriodicElement) {
    this.router.navigate([APP_ROUTES.trip, trip.id]);
  }
}
