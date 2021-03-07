import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

const routes: Routes = [
  { path: '', component: ListComponent, data: { nameRoute: 'Dispatch requests' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DispatchRoutingModule { }
