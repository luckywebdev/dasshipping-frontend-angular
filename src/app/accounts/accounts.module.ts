import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule,
} from '@angular/material';

import { DirectivesModule } from '../directives.module';
import { PhoneNumberPipe } from '../pipes/number-phone';
import { RegisterService } from '../providers/register/register.service';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountProfileComponent } from './account-profile/account-profile.component';
import { AccountsRoutingModule } from './accounts-routing.module';
import { InviteListComponent } from './invite-list/invite-list.component';
import { RequestsComponent } from './requests/requests.component';
import { TabsComponent } from './tabs/tabs.component';

@NgModule({
  declarations: [
    AccountListComponent,
    AccountProfileComponent,
    TabsComponent,
    InviteListComponent,
    RequestsComponent,
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatDatepickerModule,
    MatTooltipModule,
    DirectivesModule,
  ],
  providers: [
    RegisterService, PhoneNumberPipe,
  ],
})
export class AccountsModule { }
