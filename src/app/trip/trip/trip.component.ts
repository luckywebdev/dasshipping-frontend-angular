import { SelectionModel } from '@angular/cdk/collections';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { latLng, marker, polyline, tileLayer } from 'leaflet';

import { APP_ROUTES } from '../../app.constants';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { DispatchComponent } from '../../components/dispatch/dispatch.component';
import { TripPlannerComponent } from '../../components/trip-planner/trip-planner.component';
import { ViewNoteComponent } from '../../components/view-note/view-note.component';
import { MAP_LAYERS } from '../../constants';
import { ORDER_STATUS, ROLES_STATUS, TRIP_STATUS } from '../../enums';
import { AccountDTO, LocationDTO, OrderDTO, OrderNoteDTO, TripDTO } from '../../interfaces/models';
import { HereService } from '../../providers/here/here.service';
import { LoadingService } from '../../providers/loading/loading.service';
import { NotificationService } from '../../providers/notification/notification.service';
import { OrderService } from '../../providers/order/order.service';
import { TripService } from '../../providers/trip/trip.service';
import { UserService } from '../../providers/user/user.service';

interface PeriodicElement {
  id: number;
  pickLocation: string;
  deliveryLocation: string;
  cargo: string;
  shipper: string;
  trailerType: string;
  distance: number;
  companyId: number;
  dispatcherId: number;
  action: boolean;
  isDispatch: boolean;
  declineNote: string;
  price: string;
  status: string;
  originalStatus: string;
  uuid: string;
}

export interface Group {
  group: string;
  id: number;
}

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.scss'],
})
export class TripComponent implements OnInit {
  streetsMap = false;
  streetMaps = tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  });
  layers: any = [this.streetMaps];
  center = latLng(37.6647979, -97.5837762);
  zoom = 5;
  map: any;
  id: string;
  driver: AccountDTO;
  drivers: AccountDTO[] = [];
  orders: OrderDTO[] = [];
  limit = 10;
  skipDriver = 0;
  countDriver = 0;
  driverId: number;
  trip: TripDTO;
  displayedColumns: string[] = [
    'select',
    'id',
    'pickLocation',
    'distance',
    'deliveryLocation',
    'cargo',
    'shipper',
    'trailerType',
    'action',
  ];
  dataSource = new MatTableDataSource<PeriodicElement | Group>();
  selection = new SelectionModel<PeriodicElement | Group>(true, []);
  @ViewChild('fileInput') fileInput;

  constructor(
    private userService: UserService,
    private tripService: TripService,
    private loadingService: LoadingService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    private hereService: HereService,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private notificationService: NotificationService,
  ) { }

  public toggleChange() {
    this.streetsMap = !this.streetsMap;
    const layer = this.streetsMap ? MAP_LAYERS[1] : MAP_LAYERS[0];
    this.streetMaps = tileLayer(layer, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    });
    this.layers[0] = this.streetMaps;
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.hereService.setIconsLeaflet();
    this.loadingService.startLoading();
    this.getTrip();
    this.getDrivers();
    this.getOrdersTrip();
  }

  private getDrivers() {
    this.userService
      .getList(this.skipDriver, this.limit, null, null, ROLES_STATUS.DRIVER)
      .subscribe((res) => {
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

  public onMapReady(map) {
    this.map = map;
    setTimeout(
      () => {
        this.map.invalidateSize();
      },
      400);
  }

  private getNote(notes: OrderNoteDTO[]) {
    const note = notes.find(item => item.eventKey === 'decline_order');
    return note ? note.note : null;
  }

  private permissionRead(status) {
    return [
      ORDER_STATUS.DISPATCHED,
      ORDER_STATUS.PAID,
      ORDER_STATUS.ON_PICKUP,
      ORDER_STATUS.ON_WAY_TO_DELIVERY,
      ORDER_STATUS.ON_WAY_TO_PICKUP,
      ORDER_STATUS.BILLED,
      ORDER_STATUS.DELIVERED,
      ORDER_STATUS.PICKED_UP,
      ORDER_STATUS.DISPATCHED,
    ].includes(status);
  }

  private setOrder(order: OrderDTO) {
    this.setMarker(order.pickLocation, 'P.', order.id);
    this.setMarker(order.deliveryLocation, 'D.', order.id);
    const status: any = order.status;
    const { sender, receiver, shipper } = order;
    if (
      ![ORDER_STATUS.CANCELED, ORDER_STATUS.CANCELED_CLIENT].includes(status)
    ) {
      return {
        id: order.id,
        cargo: order.cars
          .map(
            (car, index) =>
              `${index + 1}. ${car.year} ${car.make} ${car.model} ${car.type}`,
          )
          .join('<br>'),
        pickLocation:
          // tslint:disable-next-line: prefer-template
          `${this.orderService.fullAddress(order.pickLocation, this.permissionRead(order.status))}<br>
        ${order.pickLocation && order.pickLocation.addressType ? order.pickLocation.addressType + '<br>' : ''}
        ${this.orderService.toFormatDate(order.pickDate, 'DD-MM-YYYY')}
        ` +
          (this.permissionRead(order.status) && sender
            ? `<br> <span class='order-contact'>Contact person:</span><br>
        ${sender.firstName} ${sender.lastName},<br>
        Phone:${sender.phoneNumber}<br>
        Email:${sender.email}`
            : ''),
        deliveryLocation:
          // tslint:disable-next-line: prefer-template
          `${this.orderService.fullAddress(
            order.deliveryLocation,
            this.permissionRead(order.status),
          )}<br>
        ${
          order.deliveryLocation && order.deliveryLocation.addressType
            ? order.deliveryLocation.addressType + '<br>'
            : ''
          }
        ${this.orderService.toFormatDate(order.deliveryDate, 'DD-MM-YYYY')}
       ` +
          (this.permissionRead(order.status) && receiver
            ? `<br> <span class='order-contact'>Contact person:</span><br>
       ${receiver.firstName} ${receiver.lastName},<br>
       Phone:${receiver.phoneNumber}<br>
       Email:${receiver.email}`
            : ''),
        shipper: shipper && shipper.companyName,
        distance: this.orderService.formatDistance(order.distance),
        trailerType: order.trailerType ? order.trailerType : '',
        status: this.orderService.formatStatus(order.status).toUpperCase(),
        originalStatus: order.status,
        price: order.salePrice
          ? this.orderService.formatPrice(order.salePrice)
          : '',
        isDispatch: !!(order.dispatches && order.dispatches.length),
        declineNote:
          order.status === ORDER_STATUS.DECLINED
            ? this.getNote(order.notes)
            : null,
        action: true,
        companyId: order.companyId,
        dispatcherId: order.dispatcherId,
        uuid: `#${order.uuid}`,
      };
    }
    return {
      id: order.id,
      group: 'Not available',
      action: true,
      status: 'Unavailable',
    };
  }

  private getOrdersTrip() {
    this.tripService
      .getOrdersByTrip({}, parseInt(this.id, 10))
      .subscribe((res) => {
        this.orders = res.data;
        const orders = res.data.map(item => this.setOrder(item));
        this.dataSource.data = orders;
        this.loadingService.stopLoading();
      });
  }

  public checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id
      }`;
  }

  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  public masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  public isGroup(_index, item): boolean {
    return item.group;
  }

  private setTrip() {
    this.removeRoute();
    const { route, driverId, driver } = this.trip;
    this.driverId = driverId;
    this.driver = driver;
    if (route && route.length) {
      const routes: any = route.map(item => item.split(','));
      const center = Math.round(route.length / 2);
      const [lat, lon] = route[center].split(',');
      this.center = latLng(parseFloat(lat), parseFloat(lon));
      const polylineRoute: any = polyline(routes);
      this.ngZone.run(() => {
        this.layers.push(polylineRoute);
      });
    }
    this.loadingService.stopLoading();
  }

  private getTrip() {
    this.tripService.get(this.id).subscribe((res) => {
      this.trip = {
        ...res,
        distance: this.orderService.formatDistance(res.distance),
        totalPrice: this.orderService.formatPrice(res.totalPrice),
        costPerMile: res.totalPrice
          ? this.orderService.formatPricePerMile(res.totalPrice / res.distance)
          : 0,
      };
      this.setTrip();
    });
  }

  private removeRoute() {
    this.layers = [this.streetMaps];
  }

  public openTripPlanner() {
    const orders = this.orders.map((item) => {
      return { ...item, tripId: this.trip.id };
    });
    const dialogRef = this.dialog.open(TripPlannerComponent, {
      width: '80%',
      data: {
        orders,
        selectedTrip: this.trip.id,
        tripDetails: true,
        tripMetadata: {
          route: this.trip.route,
          costPerMile: this.trip.costPerMile,
          price: this.trip.totalPrice,
          distance: this.trip.distance,
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.trip = {
          ...this.trip,
          ...result,
          distance: this.orderService.formatDistance(result.distance),
          totalPrice: this.orderService.formatPrice(result.totalPrice),
          costPerMile: result.totalPrice
            ? this.orderService.formatPricePerMile(
              result.totalPrice / result.distance,
            )
            : 0,
        };
        this.setTrip();
        this.getOrdersTrip();
      }
    });
  }

  private setMarker(location: LocationDTO, action: string, orderId: number) {
    if (location) {
      const { lat, lon } = location;
      const popup = `${action} order #${orderId} <br>  ${location.city}, ${location.state}`;
      const newMarker: any = marker([parseFloat(lat), parseFloat(lon)])
        .bindPopup(popup)
        .on('mouseover', (ev) => {
          ev.target.openPopup();
        });
      this.ngZone.run(() => {
        this.layers.push(newMarker);
      });
    }
  }

  public assignDriver() {
    const action =
      this.driverId &&
        this.trip.driverId &&
        this.driverId === this.trip.driverId
        ? 'unassign'
        : 'assign';
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: `Confirm ${action} Driver`,
        description: 'Are you sure?',
        nameButton: 'Confirm',
        reason: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.callActionToTrip(action);
      }
    });
  }

  private callActionToTrip(action: string) {
    this.loadingService.startLoading();
    this.tripService.changeState(this.trip.id, action, this.driverId).subscribe(
      () => {
        if (action === 'unassign') {
          this.driverId = null;
        }
        this.trip.driverId = this.driverId;
        this.selectedDriver();
        this.loadingService.stopLoading();
      },
      () => {
        this.getTrip();
      },
    );
  }

  public selectedDriver() {
    const driver = this.drivers.find(item => item.id === this.driverId);
    this.ngZone.run(() => {
      this.driver = driver ? driver : null;
    });
  }

  public checkRemoveOrders() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm Delete',
        description: 'Are you sure?',
        nameButton: 'Confirm',
        reason: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        this.selection.clear();
        return;
      }
      this.removeOrders();
    });
  }

  public removeOrders() {
    this.loadingService.startLoading();
    const deleteOrders = this.selection.selected.map(order => order.id);
    this.tripService.removeOrders(this.trip.id, deleteOrders).subscribe(() => {
      this.selection.clear();
      this.getOrdersTrip();
      this.getTrip();
    });
  }

  public request(order: PeriodicElement) {
    const existOrder = this.orders.find(item => order.id === item.id);
    const options = {
      data: {
        orderId: existOrder.id,
        pickDate: existOrder.pickDate,
        deliveryDate: existOrder.deliveryDate,
        message: 'Create request dispatch',
      },
      width: '450px',
    };
    const dialogRef = this.dialog.open(DispatchComponent, options);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadingService.startLoading();
        this.getOrdersTrip();
      }
    });
  }

  public disableActionButton() {
    const ordersDispatched = this.orders.filter(
      item => item.status === ORDER_STATUS.DISPATCHED,
    );
    return !(
      ordersDispatched.length === this.orders.length &&
      this.orders.length &&
      this.trip &&
      this.trip.driverId
    );
  }

  public actionTodriver() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action:
          // tslint:disable-next-line: prefer-template
          'Confirm ' +
          (this.trip.status === 'draft'
            ? 'Send to driver'
            : 'Regain from driver'),
        description: 'Are you sure?',
        nameButton: 'Confirm',
        reason: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const action =
          this.trip.status === 'draft' ? 'publish' : 'move_to_draft';
        this.loadingService.startLoading();
        this.tripService.changeState(this.trip.id, action)
          .subscribe((res) => {
            this.trip = { ...this.trip, status: res.status };
            this.loadingService.stopLoading();
          });
      }
    });
  }

  public openNote(element: PeriodicElement) {
    this.dialog.open(ViewNoteComponent, {
      width: '450px',
      data: {
        note: element.declineNote,
      },
    });
  }

  public permissionImport() {
    const { user } = this.userService;
    return (
      user &&
      user.roleId === ROLES_STATUS.COMPANY_ADMIN &&
      this.trip &&
      this.trip.status !== TRIP_STATUS.COMPLETED
    );
  }

  public async goOrder(element: PeriodicElement) {
    this.loadingService.startLoading();
    const { user } = this.userService;
    if (
      user.roleId === ROLES_STATUS.COMPANY_ADMIN &&
      user.companyId === element.companyId
    ) {
      await this.router.navigate([APP_ROUTES.order, element.id]);
    } else if (
      user.roleId === ROLES_STATUS.DISPATCHER &&
      user.companyId === element.companyId &&
      user.id === element.dispatcherId
    ) {
      await this.router.navigate([APP_ROUTES.order, element.id]);
    } else {
      this.notificationService.success(
        'This order is not still assigned to you',
      );
    }
    this.loadingService.stopLoading();
  }

  public importOrder(file: File) {
    if (!file) {
      return;
    }

    this.loadingService.startLoading();
    this.fileInput.nativeElement.value = null;
    this.orderService.importOrderToTrip(file, this.id)
      .subscribe((res) => {
        this.dataSource.data = [this.setOrder(res), ...this.dataSource.data];
        this.orders = [res, ...this.orders];
        this.loadingService.stopLoading();
      });
  }

  public activeButton() {
    return !(this.trip && this.trip.status !== TRIP_STATUS.COMPLETED);
  }

  public verifyDispatch(element: PeriodicElement) {
    return (
      [ORDER_STATUS.PUBLISHED.toString()].includes(element.originalStatus) &&
      !element.isDispatch &&
      element.price
    );
  }
}
