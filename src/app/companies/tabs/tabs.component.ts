import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { CompanyInviteComponent } from '../company-invite/company-invite.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
  selectedTab = 0;
  newInvite: any;
  counts = {
    active: 0,
    requested: 0,
    invitations: 0,
  };

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  public changeCount(count: number, key: string) {
    this.counts[key] = count;
  }

  public addCompany() {
    const ref = this.dialog.open(CompanyInviteComponent, { width: '450px' });
    ref.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.selectedTab = 2;
          this.newInvite = result;
        }
      });
  }
}
