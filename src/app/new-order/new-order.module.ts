import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
} from '@angular/material';

import { DirectivesModule } from '../directives.module';
import { NewOrderRoutingModule } from './new-order-routing.module';
import { OrderComponent } from './order/order.component';

@NgModule({
  declarations: [OrderComponent],
  imports: [
    CommonModule,
    NewOrderRoutingModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    DirectivesModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatDialogModule
  ]
})
export class NewOrderModule {}
