import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
} from '@angular/material';

import { DirectivesModule } from '../directives.module';
import { PhoneNumberPipe } from '../pipes/number-phone';
import { CompaniesRoutingModule } from './companies-routing.module';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyComponent } from './company/company.component';
import { InviteListComponent } from './invite-list/invite-list.component';
import { TabsComponent } from './tabs/tabs.component';

@NgModule({
  declarations: [
    CompanyListComponent,
    CompanyComponent,
    TabsComponent,
    InviteListComponent,
  ],
  imports: [
    CommonModule,
    CompaniesRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    FormsModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSortModule,
    ReactiveFormsModule,
    DirectivesModule,
    MatSelectModule,
  ],
  providers: [PhoneNumberPipe],
})
export class CompaniesModule { }
