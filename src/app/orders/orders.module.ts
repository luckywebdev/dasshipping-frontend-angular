import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatTabsModule,
} from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select';

import { DirectivesModule } from '../directives.module';
import { ListComponent } from './list/list.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { TabsComponent } from './tabs/tabs.component';
import { NewListComponent } from './new-list/new-list.component';

@NgModule({
  declarations: [ListComponent, NewListComponent, TabsComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    NgSelectModule,
    MatButtonModule,
    MatIconModule,
    DirectivesModule,
  ],
})
export class OrdersModule { }
