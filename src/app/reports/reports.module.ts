import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatTableModule,
} from '@angular/material';

import { CustomComponent } from './custom/custom.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { RevenueComponent } from './revenue/revenue.component';
import { UserComponent } from './user/user.component';

@NgModule({
  declarations: [RevenueComponent, UserComponent, CustomComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
  ],
})
export class ReportsModule { }
