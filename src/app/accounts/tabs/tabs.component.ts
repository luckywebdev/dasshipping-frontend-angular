import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ROLES_STATUS } from '../../enums';
import { UserService } from '../../providers/user/user.service';
import { AccountInviteComponent } from '../account-invite/account-invite.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
  public selectedTab = 0;
  newInvite: any;

  constructor(
    public dialog: MatDialog,
    public userService: UserService,
  ) { }

  ngOnInit() {
  }

  public getPermission() {
    return this.userService.user && this.userService.user.roleId === ROLES_STATUS.COMPANY_ADMIN;
  }

  public addUser() {
    const ref = this.dialog.open(AccountInviteComponent, { width: '450px' });
    ref.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.selectedTab = 1;
          this.newInvite = result;
        }
      });
  }
}
