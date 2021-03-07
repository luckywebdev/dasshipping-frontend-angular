import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatIconModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatTableModule,
} from '@angular/material';

import { DirectivesModule } from '../directives.module';
import { DispatchRoutingModule } from './dispatch-routing.module';
import { ListComponent } from './list/list.component';

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    DispatchRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    DirectivesModule,
  ],
})
export class DispatchModule { }
