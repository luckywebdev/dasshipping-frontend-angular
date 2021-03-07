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
  MatSlideToggleModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
} from '@angular/material';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgSelectModule } from '@ng-select/ng-select';

import { DirectivesModule } from '../directives.module';
import { ListAvailableComponent } from './list-available/list.component';
import { ListComponent } from './list/list.component';
import { OrderRoutingModule } from './order-routing.module';
import { TabsComponent } from './tabs/tabs.component';

@NgModule({
  declarations: [ListComponent, ListAvailableComponent, TabsComponent],
  imports: [
    CommonModule,
    OrderRoutingModule,
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
    NgSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatCardModule,
    LeafletModule,
    MatTabsModule,
    MatSlideToggleModule,
  ],
})
export class OrderModule { }
