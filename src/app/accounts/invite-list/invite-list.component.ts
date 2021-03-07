import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../providers/notification/notification.service';
import { RegisterService } from '../../providers/register/register.service';
import { UserService } from '../../providers/user/user.service';

interface PeriodicElement {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  expire: string;
  role: string;
  status: string;
  existNotify: boolean;
  notifyIds: number[];
}

@Component({
  selector: 'app-invite-list',
  templateUrl: './invite-list.component.html',
  styleUrls: ['./invite-list.component.scss'],
})
export class InviteListComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line:no-input-rename
  @Input('newInvite') set newInvite(value) {
    this.updateList(value);
  }

  @ViewChild(MatSort, {}) sort: MatSort;

  displayedColumns: string[] = [
    'select',
    'name',
    'email',
    'createdAt',
    'expire',
    'role',
    'status',
  ];
  dataSource = new MatTableDataSource<PeriodicElement>();

  selection = new SelectionModel<PeriodicElement>(true, []);
  limit = 10;
  skip = 0;
  countInvitations = 0;
  pageLimit = [5, 10];
  order: string;
  orderBy: string;
  loading = false;
  inviteSubscription: Subscription;

  constructor(
    private registerService: RegisterService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.getList();
    this.inviteSubscription = this.userService
      .updateUsers
      .subscribe(() => {
        this.getList(false);
      });
  }

  ngOnDestroy() {
    if (this.inviteSubscription) {
      this.inviteSubscription.unsubscribe();
    }
  }

  private updateList(invite) {
    if (invite && invite.id) {
      const { notifications } = invite;
      const newInvite = {
        id: invite.id,
        email: invite.email,
        name: `${invite.firstName} ${invite.lastName}`,
        role: invite.role.name,
        createdAt: moment(invite.createdAt).format('MM/DD/YYYY'),
        expire: moment(invite.expire).format('MM/DD/YYYY'),
        status: invite.status.name,
        existNotify: !!(notifications && notifications.length),
        notifyIds: notifications && notifications.length ? notifications.map(item => item.id) : [],
      };
      this.dataSource.data = [newInvite, ...this.dataSource.data];
      this.countInvitations = this.countInvitations + 1;
    }
  }

  private getList(loading = true) {
    this.loading = loading;
    this.registerService
      .getListInvite(this.skip, this.limit, this.order, this.orderBy)
      .subscribe(
        (res) => {
          const resp = res.data.map((invite) => {
            const { notifications } = invite;
            return {
              id: invite.id,
              email: invite.email,
              name: `${invite.firstName} ${invite.lastName}`,
              role: invite.role.name,
              createdAt: moment(invite.createdAt).format('MM/DD/YYYY'),
              expire: moment(invite.expire).format('MM/DD/YYYY'),
              status: invite.status.name,
              existNotify: !!(notifications && notifications.length),
              notifyIds: notifications && notifications.length ? notifications.map(item => item.id) : [],
            };
          });
          this.dataSource.data = resp;
          this.countInvitations = res.count;
          this.loading = false;
        },
        () => {
          this.loading = false;
        },
      );
  }

  public goInvite(row: PeriodicElement) {
    if (row.notifyIds.length) {
      row.notifyIds.forEach((notifyId) => {
        this.notificationService.markAsViewed(notifyId)
          .subscribe(() => {
            this.userService.setUser('notificationUsers', -1);
          });
      });
      this.dataSource.data = this.dataSource.data.map((item) => {
        if (item.id === row.id) {
          return {
            ...item,
            existNotify: false,
            notifyIds: [],
          };
        }
        return item;
      });
    }
  }

  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  public masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  public checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id
      }`;
  }

  public changePage(event: PageEvent) {
    this.skip = event.pageIndex * this.limit;
    this.limit = event.pageSize;
    this.getList();
  }

  public resendInvitations() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm Resend',
        description: 'Are you sure you want to resend invite?',
        nameButton: 'Confirm',
        reason: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        this.selection.clear();
        return;
      }
      this.resendInvite();
    });
  }

  public resendInvite() {
    const invitations = this.selection.selected.map(invite =>
      invite.id.toString(),
    );
    this.registerService.inviteResend({ ids: invitations }).subscribe(
      () => {
        this.notificationService.success('Success resend!');
        this.selection.clear();
      },
      () => {
        this.selection.clear();
      },
    );
  }

  public expireInvitations() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm Expire',
        description: 'Are you sure you want to expire invite?',
        nameButton: 'Confirm',
        reason: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        this.selection.clear();
        return;
      }
      this.expireInvite();
    });
  }

  public expireInvite() {
    const invitations = this.selection.selected.map(invite =>
      invite.id.toString(),
    );
    this.registerService.inviteExpire({ ids: invitations }).subscribe(
      () => {
        this.notificationService.success('Success expired!');
        this.selection.clear();
      },
      () => {
        this.selection.clear();
      },
    );
  }

  public sortData(event) {
    this.orderBy = event.active;
    this.order = event.direction;
    this.getList();
  }
}
