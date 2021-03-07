import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { control, latLng, marker, tileLayer } from 'leaflet';

import { APP_ROUTES } from '../../app.constants';
import { MAP_LAYERS } from '../../constants';
import { AccountDTO } from '../../interfaces/models';
import { HereService } from '../../providers/here/here.service';
import { UserService } from '../../providers/user/user.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit {
  streetsMap = false;
  driverId: string;

  options = {
    layers: tileLayer(this.streetsMap ? MAP_LAYERS[1] : MAP_LAYERS[0], {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }),
    zoom: 5,
    center: latLng(37.6647979, -97.5837762),
  };
  layers: any = [this.options.layers];
  map: any;

  constructor(
    private userService: UserService,
    private hereService: HereService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.driverId = this.route.snapshot.paramMap.get('driverID');
    console.log(this.driverId);
    this.getLocations();
    this.hereService.setIconsLeaflet();
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

  public toggleChange() {
    this.streetsMap = !this.streetsMap;
    const layer = this.streetsMap ? MAP_LAYERS[1] : MAP_LAYERS[0];
    const layers = tileLayer(layer, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    });
    this.layers[0] = layers;
  }

  private getLocations() {
    this.userService.driversLastLocation()
      .subscribe((res) => {
        console.log("user_location", res);
        res.forEach((user) => {
          if (user.id == parseInt(this.driverId)) {
            this.setMarkers(user)
          }
        });
      });
  }

  private goDriver(id: number) {
    this.router.navigateByUrl(`${APP_ROUTES.accounts}/${id}`);
  }

  private setEvent(id: number) {
    const goDriver = document.getElementById(`driver_${id}`);
    if (!goDriver) {
      setTimeout(
        () => {
          this.setEvent(id);
        },
        1000);
    } else {
      goDriver.addEventListener('click', () => {
        this.goDriver(id);
      });
    }
  }

  private setMarkers(account: AccountDTO) {
    const { locations } = account;
    if (locations && locations.length) {
      const [location] = locations;
      const { lat, lon } = location;

      const avatar = account.avatarUrl || 'assets/image/avatar-default.jpg';
      const popup = `
      <div class="flex flex--row marker_block" id="driver_${account.id}">
          <img class="marker_block--img" src="${avatar}">
          <span>${account.firstName} ${account.lastName}</span>
      </div>`;

      const newMarker: any = marker(
        [lat, lon],
      )
        .bindPopup(popup)
        .on('mouseover', (ev) => {
          ev.target.openPopup();
        });
      this.setEvent(account.id);
      this.layers.push(newMarker);
    }
  }

}
