import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { APP_ROUTES } from '../app.constants';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  { path: '', redirectTo: APP_ROUTES.list, pathMatch: 'full' },
  { path: APP_ROUTES.list, component: ListComponent, data: { nameRoute: 'Price policy' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PolicyRoutingModule { }
