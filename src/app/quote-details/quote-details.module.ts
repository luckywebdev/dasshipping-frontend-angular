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
  MatSelectModule,
  MatSlideToggleModule,
} from '@angular/material';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { DirectivesModule } from '../directives.module';
import { QouteComponent } from './qoute/qoute.component';
import { QuoteDetailsRoutingModule } from './quote-details-routing.module';

@NgModule({
  declarations: [QouteComponent],
  imports: [
    CommonModule,
    QuoteDetailsRoutingModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    DirectivesModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatCardModule,
    LeafletModule,
    MatSlideToggleModule,
  ],
})
export class QuoteDetailsModule { }
