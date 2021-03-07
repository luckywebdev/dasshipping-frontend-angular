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
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatSlideToggleModule,
} from '@angular/material';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { DirectivesModule } from '../directives.module';
import { ListComponent } from './list/list.component';
import { TripRoutingModule } from './trip-routing.module';
import { TripComponent } from './trip/trip.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [ListComponent, TripComponent],
  imports: [
    CommonModule,
    TripRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSortModule,
    DirectivesModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatCardModule,
    NgSelectModule,
    MatTabsModule,
    MatSlideToggleModule,
    LeafletModule.forRoot(),
  ],
})
export class TripModule { }
