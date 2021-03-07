import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { control, icon, latLng, marker, polyline, tileLayer } from 'leaflet';

import { APP_ROUTES } from '../../app.constants';
import { NewDiscountComponent } from '../../components/new-price/new-price.component';
import { MAP_LAYERS } from '../../constants';
import { LocationDTO, QuoteDTO } from '../../interfaces/models';
import { HereService } from '../../providers/here/here.service';
import { LoadingService } from '../../providers/loading/loading.service';
import { OrderService } from '../../providers/order/order.service';
import { UserService } from '../../providers/user/user.service';

@Component({
  selector: 'app-qoute',
  templateUrl: './qoute.component.html',
  styleUrls: ['./qoute.component.scss'],
})
export class QouteComponent implements OnInit {
  id: string;
  quote: QuoteDTO;
  streetsMap = false;
  options = {
    layers: tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }),
    zoom: 5,
    zoomControl: false,
    center: latLng(37.6647979, -97.5837762),
  };
  layers: any = [this.options.layers];
  map: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private orderService: OrderService,
    private dialog: MatDialog,
    private hereService: HereService,
    public userService: UserService,
  ) { }

  public information = this.fb.group({
    qouteId: new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]),
    status: new FormControl(''),
  });

  public pickLocation = this.fb.group({
    state: new FormControl(''),
    city: new FormControl(''),
    zipCode: new FormControl(''),
    address: new FormControl(''),
    addressType: new FormControl(''),
    instructions: new FormControl(''),
  });

  public deliveryLocation = this.fb.group({
    state: new FormControl(''),
    city: new FormControl(''),
    zipCode: new FormControl(''),
    address: new FormControl(''),
    addressType: new FormControl(''),
    instructions: new FormControl(''),
  });

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadingService.startLoading();
    this.getQoute();
  }

  public toggleChange() {
    this.streetsMap = !this.streetsMap;
    const layer = this.streetsMap ? MAP_LAYERS[1] : MAP_LAYERS[0];
    const layers = tileLayer(layer, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    });
    this.layers[0] = layers;
  }

  public onMapReady(map) {
    this.map = map;
    setTimeout(
      () => {
        this.map.invalidateSize();
      },
      400);
    this.map.addControl(control.zoom({ position: 'bottomright' }));
  }

  private getQoute() {
    this.orderService.getQoute(this.id).subscribe(
      (res) => {
        this.setOrderData(res);
      },
      () => {
        this.router.navigateByUrl(`${APP_ROUTES.order}/${APP_ROUTES.list}`);
      },
    );
  }

  private setValue(form: string) {
    Object.keys(this.quote[form]).forEach((key) => {
      if (this[form].controls[key] && this.quote[form][key]) {
        this[form].controls[key].setValue(this.quote[form][key]);
      }
    });
  }

  private setOrderData(res: QuoteDTO) {
    this.layers = [this.options.layers];
    this.quote = res;
    this.information.controls.qouteId.setValue(res.id);
    this.information.controls.status.setValue(res.status);
    this.setValue('pickLocation');
    this.setValue('deliveryLocation');
    this.getRoute();
    this.setMarkers(res.pickLocation, true);
    this.setMarkers(res.deliveryLocation);
    this.loadingService.stopLoading();
  }

  private setMarkers(value: LocationDTO, start: boolean = false) {
    if (value && value.lat) {
      const newMarker: any = marker(
        [parseFloat(value.lat), parseFloat(value.lon)],
        {
          icon: icon({
            iconSize: [40, 40],
            iconAnchor: [15, 35],
            iconUrl: start
              ? 'assets/image/start.png'
              : 'assets/image/finish.png',
          }),
        },
      );
      this.layers.push(newMarker);
    }
  }

  private getRoute() {
    if (this.quote.pickLocation && this.quote.pickLocation.lat) {
      const point0 = `geo!${this.quote.pickLocation.lat},${this.quote.pickLocation.lon}`;
      const point1 = `geo!${this.quote.deliveryLocation.lat},${this.quote.deliveryLocation.lon}`;
      this.options.center = latLng(
        parseFloat(this.quote.pickLocation.lat),
        parseFloat(this.quote.pickLocation.lon),
      );
      this.hereService.getRoute(point0, point1).subscribe((res) => {
        if (!res && !res.length) {
          return;
        }
        const [route] = res;
        const { shape } = route;
        if (shape && shape.length) {
          const routes = shape.map(item => item.split(','));
          const center = Math.round(shape.length / 2);
          const [lat, lon] = shape[center].split(',');
          this.options.center = latLng(lat, lon);
          const polylineRoute: any = polyline(routes);
          this.layers.push(polylineRoute);
        }
      });
    }
  }

  public roundPrice(price: number) {
    return price ? price.toFixed() : '';
  }

  public roundPerMile(value: number) {
    return this.orderService.formatPricePerMile(value);
  }

  public newDiscount() {
    const dialogRef = this.dialog.open(NewDiscountComponent, {
      data: {
        id: parseInt(this.id, 10),
      },
      width: '450px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.quote = result;
      }
    });
  }

  public save(param) {
    console.log(param);
    alert('Save is not implemented');
  }
}
