import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { icon, latLng, marker, polyline, tileLayer } from 'leaflet';

import { MAP_LAYERS } from '../../constants';
import {
  CalculateTripDTO,
  DistanceResponseDTO,
  LocationTripDTO,
  OrderDTO,
  TripDTO,
  TripEditRequest,
} from '../../interfaces/models';
import { HereService } from '../../providers/here/here.service';
import { LoadingService } from '../../providers/loading/loading.service';
import { NotificationService } from '../../providers/notification/notification.service';
import { OrderService } from '../../providers/order/order.service';
import { TripService } from '../../providers/trip/trip.service';
import { CreateTripComponent } from '../create-trip/create-trip.component';

interface DialogData {
  orders: OrderDTO[];
  selectedTrip?: number;
  tripDetails: boolean;
  tripMetadata?: {
    costPerMile: string;
    price: number;
    distance: number;
    route: any;
  };
}
interface LocalLocation {
  orderId: number;
  visible: boolean;
  point: string;
  origin: string;
  type: boolean;
}

@Component({
  selector: 'app-trip-planner',
  templateUrl: './trip-planner.component.html',
  styleUrls: ['./trip-planner.component.scss'],
})
export class TripPlannerComponent implements OnInit {
  map: any;
  streetsMap = true;
  streetMaps = tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  });
  layers: any = [this.streetMaps];
  center = latLng(37.6647979, -97.5837762);
  zoom = 5;
  resultCalculate: DistanceResponseDTO;
  locations: LocalLocation[] = [];
  carsLength = 0;
  trips: TripDTO[];
  limit = 10;
  skip = 0;
  tripCount = 0;
  selectedTrip: number;
  locationsRoute: LocationTripDTO[] = [];

  constructor(
    private hereService: HereService,
    private loadingService: LoadingService,
    private tripService: TripService,
    private orderService: OrderService,
    private notificationService: NotificationService,
    private ngZone: NgZone,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<TripPlannerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit() {
    this.setInitialData();
    this.hereService.setIconsLeaflet();
  }

  public toggleChange() {
    this.streetsMap = !this.streetsMap;
    const layer = this.streetsMap ? MAP_LAYERS[1] : MAP_LAYERS[0];
    this.streetMaps = tileLayer(layer, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    });
    this.layers[0] = this.streetMaps;
  }

  private setInitialData() {
    const { selectedTrip, tripMetadata, orders } = this.data;
    if (tripMetadata) {
      orders.forEach(item => {
        this.carsLength = this.carsLength + item.cars.length;
      });
      this.setDataLocations();
      const { costPerMile, price, distance, route } = tripMetadata;
      this.setRoute(route);
      this.resultCalculate = {
        costPerMile,
        price,
        distance,
        locations: [],
      };
    } else {
      this.prepareRequest();
      this.getTrips();
    }
    if (selectedTrip) {
      this.selectedTrip = selectedTrip;
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

  private getTrips() {
    this.tripService
      .getList({
        offset: this.skip,
        limit: this.limit,
      })
      .subscribe((res) => {
        this.trips = res.data;
        this.tripCount = res.count;
      });
  }

  public getListTrips() {
    if (this.trips.length < this.tripCount) {
      this.skip = this.skip + this.limit;
      this.getTrips();
    }
  }

  private prepareRequest(orders: OrderDTO[] = [], optimize: boolean = false) {
    let ordersMap = orders;
    if (!orders.length) {
      ordersMap = this.data.orders;
    } else {
      this.carsLength = 0;
    }
    const locations = ordersMap.map((item, index) => {
      this.carsLength = this.carsLength + item.cars.length;
      return {
        origin: `${item.pickLocation.city}, ${item.pickLocation.state}`,
        destination: `${item.deliveryLocation.city}, ${item.deliveryLocation.state}`,
        isStartPoint: !!(index === 0),
        isEndPoint: false,
        cost: item.salePrice ? item.salePrice : 0,
        key: item.id,
      };
    });
    this.loadingService.startLoading();
    this.callCalculate(locations, optimize);
  }

  private callCalculate(locations: CalculateTripDTO[], optimize: boolean) {
    this.hereService
      .calculateRoute({ optimize, locations })
      .subscribe((res: DistanceResponseDTO) => {
        this.removeMarkers();
        this.resultCalculate = {
          ...res,
          costPerMile: this.orderService.formatPricePerMile(
            parseFloat(res.costPerMile),
          ),
          price: this.orderService.formatPrice(res.price),
          distance: this.orderService.formatDistance(res.distance),
        };
        this.prepareResponse(res);
      });
  }

  private setDataLocations() {
    const { orders } = this.data;
    let locations: LocationTripDTO[] = orders.map((item) => {
      return {
        origin: `${item.pickLocation.city}, ${item.pickLocation.state}`,
        point: `${item.pickLocation.lat}, ${item.pickLocation.lon}`,
        key: item.id,
      };
    });
    const locationsDelivery: LocationTripDTO[] = orders.map((item) => {
      return {
        origin: `${item.deliveryLocation.city}, ${item.deliveryLocation.state}`,
        point: `${item.deliveryLocation.lat}, ${item.deliveryLocation.lon}`,
        key: item.id,
      };
    });
    locations = [...locations, ...locationsDelivery];
    this.setLocations(locations);
  }

  private prepareResponse(res: DistanceResponseDTO) {
    this.layers = [this.streetMaps];
    this.locationsRoute = res.locations;
    this.setLocations(res.locations);
    const points = res.locations.map(item => item.point);
    const query: any = {};
    // tslint:disable-next-line: no-increment-decrement
    for (let i = 0; i < points.length; i++) {
      query[`waypoint${i}`] = points[i];
    }

    this.hereService
      .getRouteTrip({
        ...query,
        improveFor: 'distance',
        mode: 'fastest;truck',
        routeattributes: 'sh,bb,gr',
      })
      .subscribe((resp) => {
        const [reslut] = resp;
        const { shape } = reslut;
        this.setRoute(shape);
        setTimeout(
          () => {
            this.loadingService.stopLoading();
          },
          300);
      });
  }

  private setRoute(shape) {
    this.removeRoute();
    if (shape && shape.length) {
      const routes = shape.map(item => item.split(','));
      const center = Math.round(shape.length / 2);
      const [lat, lon] = shape[center].split(',');
      this.center = latLng(lat, lon);
      const polylineRoute: any = polyline(routes);
      this.ngZone.run(() => {
        this.layers.push(polylineRoute);
      });
    }
  }

  private setLocations(locations: LocationTripDTO[]) {
    let invisibleLocations = [];
    if (this.locations.length) {
      invisibleLocations = this.locations.filter(item => !item.visible);
      this.locations = [];
    }
    // tslint:disable-next-line: no-increment-decrement
    for (let i = 0; i < locations.length; i++) {
      this.locations[i] = {
        ...this.locations[i],
        ...locations[i],
        visible: true,
        orderId: locations[i].key,
        type: i < locations.length / 2,
      };
    }
    if (invisibleLocations.length) {
      let index = this.locations.length / 2;
      for (const location of invisibleLocations) {
        this.locations.splice(index, 0, location);
        index = index + 1;
      }
    }
    this.setMarkers();
  }

  private setMarkers() {
    for (const location of this.locations) {
      if (location.visible) {
        this.setMarker(location);
      } else {
        this.setMarkerDisable(location);
      }
    }
  }

  private setMarker(location: LocalLocation) {
    if (location) {
      const [lat, lon] = location.point.split(',');
      const popup = `${location.type ? 'P.' : 'D.'} order #${
        location.orderId
        } <br> ${location.origin}`;
      const newMarker: any = marker([parseFloat(lat), parseFloat(lon)])
        .bindPopup(popup)
        .on('click', (ev) => {
          this.checkEventMarker(ev.target);
        })
        .on('mouseover', (ev) => {
          ev.target.openPopup();
        });
      this.ngZone.run(() => {
        this.layers.push(newMarker);
      });
    }
  }

  private setMarkerDisable(location: LocalLocation) {
    if (location) {
      const [lat, lon] = location.point.split(',');
      const popup = `${location.type ? 'P.' : 'D.'} order #${
        location.orderId
        } <br> ${location.origin}`;
      const newMarker: any = marker([parseFloat(lat), parseFloat(lon)], {
        icon: icon({
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -30],
          iconUrl: 'assets/image/marker_disable.png',
        }),
      })
        .bindPopup(popup)
        .on('click', (ev) => {
          this.checkEventMarker(ev.target);
        })
        .on('mouseover', (ev) => {
          ev.target.openPopup();
        });
      this.ngZone.run(() => {
        this.layers.push(newMarker);
      });
    }
  }

  private checkEventMarker(target) {
    const { _latlng } = target;
    if (_latlng) {
      const { lat, lng } = _latlng;
      const location = this.locations.find(
        item => item.point === `${lat},${lng}`,
      );
      if (location) {
        location.visible = !location.visible;
        this.changeVisible(location);
      }
    }
  }

  private removeRoute() {
    // tslint:disable-next-line: no-increment-decrement
    for (let i = 0; i < this.layers.length; i++) {
      const { _bounds } = this.layers[i];
      if (_bounds) {
        this.ngZone.run(() => {
          this.layers.splice(i, 1);
        });
      }
    }
  }

  private removeMarkers() {
    // tslint:disable-next-line: no-increment-decrement
    for (let i = 0; i < this.layers.length; i++) {
      const { _latlng } = this.layers[i];
      if (_latlng) {
        this.ngZone.run(() => {
          this.layers.splice(i, 1);
        });
      }
    }
  }

  private removeMarker(location: LocalLocation, enable: boolean = false) {
    const [latitude, longitude] = location.point.split(',');
    // tslint:disable-next-line: no-increment-decrement
    for (let i = 0; i < this.layers.length; i++) {
      const { _latlng } = this.layers[i];
      if (_latlng) {
        const { lat, lng } = _latlng;
        if (
          lat &&
          lng &&
          lat === parseFloat(latitude) &&
          lng === parseFloat(longitude)
        ) {
          this.ngZone.run(() => {
            this.layers.splice(i, 1);
            if (enable) {
              this.setMarker(location);
            } else {
              this.setMarkerDisable(location);
            }
          });
        }
      }
    }
  }

  public changeVisible(location) {
    const locations = this.locations.map((item) => {
      if (location.orderId === item.orderId) {
        if (location.visible) {
          this.removeMarker(item, true);
        } else {
          this.removeMarker(item);
        }
        return { ...item, visible: location.visible };
      }
      return item;
    });
    this.ngZone.run(() => {
      this.locations = locations;
    });
  }

  public optimiseRoute(optimize: boolean = false) {
    const orderIds = this.locations
      .map((item) => {
        if (item.visible) {
          return item.orderId;
        }
      })
      .filter(
        (location, i, acumulator) =>
          location && acumulator.indexOf(location) === i,
      );
    const orders = orderIds.map((item) => {
      return this.data.orders.find(order => order.id === item);
    });
    if (orders.length) {
      this.prepareRequest(orders, optimize);
    }
  }

  public drop(event: CdkDragDrop<string[]>) {
    const isPick = event.previousIndex < this.locations.length / 2;
    let newIndex = event.currentIndex;
    if (isPick) {
      if (event.currentIndex > this.locations.length / 2) {
        newIndex = this.locations.length / 2 - 1;
      }
    } else {
      if (event.currentIndex < this.locations.length / 2) {
        newIndex = this.locations.length / 2;
      }
    }
    const location = this.locations[event.previousIndex];
    this.locations.splice(event.previousIndex, 1);
    this.locations.splice(newIndex, 0, location);
  }

  public checkTrip() {
    if (this.selectedTrip) {
      this.editTrip();
    } else {
      this.createTrip();
    }
  }

  private createTrip() {
    const orderIds = this.locations
      .map((item) => {
        if (item.visible) {
          return item.orderId;
        }
      })
      .filter(
        (location, i, acumulator) =>
          location && acumulator.indexOf(location) === i,
      );
    const dialogRef = this.dialog.open(CreateTripComponent, {
      data: { orderIds },
      width: '450px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.calculateRouteTrip(result);
      }
    });
  }

  private calculateRouteTrip(trip: TripDTO) {
    if (this.locationsRoute && this.locationsRoute.length) {
      this.tripService
        .saveRoute(trip.id, {
          locations: this.locationsRoute,
        })
        .subscribe((res) => {
          this.dialogRef.close(res);
          this.loadingService.stopLoading();
        });
    } else {
      this.dialogRef.close(trip);
      this.loadingService.stopLoading();
    }
  }

  private editTrip() {
    this.loadingService.startLoading();
    const orderIds = this.locations
      .map((item) => {
        if (item.visible) {
          return item.orderId;
        }
      })
      .filter(
        (location, i, acumulator) =>
          location && acumulator.indexOf(location) === i,
      );

    const body: TripEditRequest = { orderIds };
    this.tripService.edit(this.selectedTrip, body)
      .subscribe((res) => {
        this.calculateRouteTrip(res);
        this.notificationService.success('Success edited!');
      });
  }

  public selectTrip() {
    if (this.selectedTrip) {
      this.getOrdersTrip();
    } else {
      this.loadingService.startLoading();
      this.data.orders = this.data.orders.filter(item => !item.tripId);
      this.prepareRequest();
    }
  }

  private getOrdersTrip() {
    this.loadingService.startLoading();
    this.tripService.getOrdersByTrip({}, this.selectedTrip)
      .subscribe((res) => {
        const orders = res.data
          .map((item) => {
            if (!this.data.orders.find(order => order.id === item.id)) {
              return { ...item, tripId: this.selectedTrip };
            }
          })
          .filter(item => !!item);

        this.ngZone.run(() => {
          this.data.orders = [...this.data.orders, ...orders];
        });
        this.carsLength = 0;
        this.prepareRequest();
      });
  }
}
