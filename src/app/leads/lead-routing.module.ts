import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {APP_ROUTES} from '../app.constants';
import {TabsComponent} from './tabs/tabs.component';

const routes: Routes = [
  {path: '', redirectTo: APP_ROUTES.list, pathMatch: 'full'},
  {
    path: APP_ROUTES.list,
    component: TabsComponent,
    data: {nameRoute: 'Leads'},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeadRoutingModule {}
