import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
} from '@angular/material';

import { DirectivesModule } from '../directives.module';
import { ListComponent } from './list/list.component';
import { PolicyRoutingModule } from './policy-routing.module';

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    PolicyRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSortModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    DirectivesModule,
  ],
})
export class PolicyModule { }
