import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QouteComponent } from './qoute/qoute.component';

const routes: Routes = [{
  path: '', component: QouteComponent,
  data: { nameRoute: 'Quote Details', notificationKey: 'notificationQuotes' },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuoteDetailsRoutingModule { }
