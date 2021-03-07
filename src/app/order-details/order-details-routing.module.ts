import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrderComponent } from './order/order.component';

const routes: Routes = [{
  path: '', component: OrderComponent,
  data: { nameRoute: 'Order Details', notificationKey: 'notificationOrders' },
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderDetailsRoutingModule { }
