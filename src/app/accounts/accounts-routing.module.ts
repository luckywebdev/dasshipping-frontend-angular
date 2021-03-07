import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { APP_ROUTES } from '../app.constants';
import { AccountProfileComponent } from './account-profile/account-profile.component';
import { TabsComponent } from './tabs/tabs.component';

const routes: Routes = [
  { path: '', redirectTo: APP_ROUTES.list, pathMatch: 'full' },
  {
    path: APP_ROUTES.list, component: TabsComponent, data: {
      nameRoute: 'My Team',
      notificationKey: 'notificationUsers',
    },
  },
  {
    path: ':id', component: AccountProfileComponent, data: {
      nameRoute: 'My Team',
      notificationKey: 'notificationUsers',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsRoutingModule { }
