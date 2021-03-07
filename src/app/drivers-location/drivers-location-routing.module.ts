import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LocationComponent } from './location/location.component';

const routes: Routes = [
  { path: '', component: LocationComponent, data: { nameRoute: 'Drivers location' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriversLocationRoutingModule { }
