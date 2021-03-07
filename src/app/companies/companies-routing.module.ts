import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { APP_ROUTES } from '../app.constants';
import { CompanyComponent } from './company/company.component';
import { TabsComponent } from './tabs/tabs.component';

const routes: Routes = [
  { path: '', redirectTo: APP_ROUTES.list, pathMatch: 'full' },
  { path: APP_ROUTES.list, component: TabsComponent, data: { nameRoute: 'Carriers', notificationKey: 'notificationCompanies' } },
  { path: ':id', component: CompanyComponent, data: { nameRoute: 'Carrier Details', notificationKey: 'notificationCompanies' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompaniesRoutingModule { }
