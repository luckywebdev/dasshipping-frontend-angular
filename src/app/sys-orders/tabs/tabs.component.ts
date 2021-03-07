import { Component } from '@angular/core';

import { ORDER_TABS } from '../../enums';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {
  public selectedTab = 0;
  orderTabs = ORDER_TABS;
  counts = {
    published: 0,
    requested: 0,
    assigned: 0,
    dispatched: 0,
    expired: 0,
    picked_up: 0,
    delivered: 0,
    claimed: 0,
  };

  public changeCount(count: number, key: string) {
    this.counts[key] = count;
  }
}
