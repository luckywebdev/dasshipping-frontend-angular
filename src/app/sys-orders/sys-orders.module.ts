import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSlideToggleModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
} from '@angular/material';

import { DirectivesModule } from '../directives.module';
import { ListComponent } from './list/list.component';
import { SysOrdersRoutingModule } from './sys-orders-routing.module';
import { TabsComponent } from './tabs/tabs.component';

@NgModule({
  declarations: [TabsComponent, ListComponent],
  imports: [
    CommonModule,
    SysOrdersRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSortModule,
    DirectivesModule,
    MatCardModule,
    MatTabsModule,
    MatSlideToggleModule,
  ],
})
export class SysOrdersModule { }
