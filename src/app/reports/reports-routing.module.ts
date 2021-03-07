import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { APP_ROUTES } from '../app.constants';
import { CustomComponent } from './custom/custom.component';
import { RevenueComponent } from './revenue/revenue.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  { path: '', redirectTo: APP_ROUTES.revenue, pathMatch: 'full' },
  { path: APP_ROUTES.revenue, component: RevenueComponent, data: { nameRoute: 'Company Revenue' } },
  { path: APP_ROUTES.user, component: UserComponent, data: { nameRoute: 'Reports by user' } },
  { path: APP_ROUTES.custom, component: CustomComponent, data: { nameRoute: 'Custom report' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule { }
