import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatSelectModule,
} from '@angular/material';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgImageSliderModule } from 'ng-image-slider';

import { DirectivesModule } from '../directives.module';
import { PhoneNumberPipe } from '../pipes/number-phone';
import { OrderDetailsRoutingModule } from './order-details-routing.module';
import { OrderComponent } from './order/order.component';

@NgModule({
  declarations: [OrderComponent],
  imports: [
    CommonModule,
    OrderDetailsRoutingModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DirectivesModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatCardModule,
    NgImageSliderModule,
    LeafletModule,
  ],
  providers: [PhoneNumberPipe],
})
export class OrderDetailsModule { }
