import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { APP_ROUTES } from '../../app.constants';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ROLES } from '../../constants';
import { ROLES_STATUS } from '../../enums';
import { AccountDTO } from '../../interfaces/models';
import { NotificationService } from '../../providers/notification/notification.service';
import { UserService } from '../../providers/user/user.service';

interface PeriodicElement {
  id: number;
  blocked: string;
  fullName: string;
  role: string;
  linkedDispatcher?: string;
  existNotify: boolean;
  notifyIds: number[];
}

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
})
export class AccountListComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, {}) sort: MatSort;

  displayedColumns: string[] = ['select', 'fullName', 'role', 'blocked'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  user: AccountDTO;
  selection = new SelectionModel<PeriodicElement>(true, []);
  limit = 10;
  skip = 0;
  order: string;
  orderBy: string;
  pageLimit = [5, 10];
  countAccounts = 0;
  loading = false;
  roles = ROLES;
  accountSubscription: Subscription;

  constructor(
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.user = this.userService.user;
    this.getList();
    this.accountSubscription = this.userService
      .updateUsers
      .subscribe(() => {
        this.getList(false);
      });
  }

  ngOnDestroy() {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
  }

  private getList(loading = true) {
    this.loading = loading;
    this.userService.getList(this.skip, this.limit, this.order, this.orderBy)
      .subscribe(
        (res) => {
          const resp = res.data.map((user) => {
            const linkedDispatcher = (user.roleId === ROLES_STATUS.DRIVER && user.dispatcher) ?
              `Linked to Dispatcher:${user.dispatcher.firstName} ${user.dispatcher.lastName}` : '';
            const { notifications } = user;
            return {
              linkedDispatcher,
              id: user.id,
              blocked: user.blocked ? 'Blocked' : user.approved ? 'Active' : 'Not Active',
              fullName: `${user.firstName} ${user.lastName}`,
              role: user.role.name,
              existNotify: !!(notifications && notifications.length),
              notifyIds: notifications && notifications.length ? notifications.map(item => item.id) : [],
            };
          });
          this.dataSource.data = resp;
          this.countAccounts = res.count;
          this.loading = false;
        },
        () => {
          this.loading = false;
        });
  }

  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  public goUser(row: PeriodicElement) {
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
    this.router.navigateByUrl(`${APP_ROUTES.accounts}/${row.id}`);
  }

  public masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  public checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  public changePage(event) {
    this.skip = event.pageIndex * this.limit;
    this.limit = event.pageSize;
    this.getList();
  }

  public checkBlockUsers() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm Block',
        description: 'Are you sure you want to block user?',
        nameButton: 'Confirm',
        reason: true,
        maxlength: 120,
        placeholder: 'Reason..',
      },
    });

    dialogRef.afterClosed()
      .subscribe((result: string) => {
        if (!result) {
          this.selection.clear();
          return;
        }
        this.blockUsers(result);
      });
  }

  public checkApproveUsers() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm Approve',
        description: 'Are you sure you want to approve user?',
        nameButton: 'Confirm',
        reason: false,
      },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (!result) {
          this.selection.clear();
          return;
        }
        this.approveUsers();
      });
  }

  public approveUsers() {
    const approveUsers = this.selection.selected.map(user => user.id);
    this.userService.setApprove({ ids: approveUsers, approved: true })
      .subscribe(
        () => {
          this.notificationService.success('Account was approved!');
          this.selection.clear();
        },
        () => {
          this.selection.clear();
        });
  }

  public blockUsers(reason?: string) {
    const blockUsers = this.selection.selected.map(user => user.id);
    this.userService.setBlock({ reason, ids: blockUsers, blocked: true })
      .subscribe(
        () => {
          this.notificationService.success('Account was blocked!');
          this.selection.clear();
        },
        () => {
          this.selection.clear();
        });
  }

  public checkRemoveUsers() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm Delete',
        description: 'Are you sure you want to delete user?',
        nameButton: 'Confirm',
        reason: false,
      },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (!result) {
          this.selection.clear();
          return;
        }
        this.removeUsers();
      });
  }

  public removeUsers() {
    const deleteUsers = this.selection.selected.map(user => user.id);
    this.userService.delete({ ids: deleteUsers, deleted: true })
      .subscribe(
        () => {
          this.dataSource.data = this.dataSource.data.filter(user => !this.selection.selected.includes(user));
          this.notificationService.success('Success deleted!');
          this.selection.clear();
        },
        () => {
          this.selection.clear();
        });
  }

  public sortData(event) {
    this.orderBy = event.active;
    this.order = event.direction;
    this.getList();
  }

}
