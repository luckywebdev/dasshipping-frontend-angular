import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { DriversLocationRoutingModule } from './drivers-location-routing.module';
import { LocationComponent } from './location/location.component';

@NgModule({
  declarations: [LocationComponent],
  imports: [
    CommonModule,
    DriversLocationRoutingModule,
    LeafletModule,
    MatSlideToggleModule,
  ],
})
export class DriversLocationModule { }
