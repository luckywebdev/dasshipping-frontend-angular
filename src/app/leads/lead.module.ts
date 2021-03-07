import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
  MatGridListModule,
  MatFormFieldModule,
} from '@angular/material';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {NgSelectModule} from '@ng-select/ng-select';

import {DirectivesModule} from '../directives.module';
import {TabsComponent} from './tabs/tabs.component';
import {ListComponent} from './list/list.component';
import {LeadRoutingModule} from './lead-routing.module';

@NgModule({
  declarations: [ListComponent, TabsComponent],
  imports: [
    CommonModule,
    LeadRoutingModule,
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
    MatFormFieldModule,
    MatGridListModule,
  ],
})
export class LeadModule {}
