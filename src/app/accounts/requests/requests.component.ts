import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import * as moment from 'moment';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { REQUESTS_STATUSES } from '../../constants';
import { JoinRequestsService } from '../../providers/joinRequests/joinRequests.service';
import { NotificationService } from '../../providers/notification/notification.service';
import { OrderService } from '../../providers/order/order.service';

interface PeriodicElement {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  driverNumber?: string;
  status: string;
}

@Component({
  selector: "app-requests",
  templateUrl: "./requests.component.html",
  styleUrls: ["./requests.component.scss"]
})
export class RequestsComponent implements OnInit {
  @ViewChild(MatSort, {}) sort: MatSort;

  displayedColumns: string[] = [
    "select",
    "name",
    "email",
    "createdAt",
    "driverNumber",
    "status"
  ];
  dataSource = new MatTableDataSource<PeriodicElement>();

  selection = new SelectionModel<PeriodicElement>(true, []);
  limit = 10;
  skip = 0;
  countRequests = 0;
  pageLimit = [5, 10];
  order: string;
  orderBy: string;
  loading = false;

  constructor(
    private joinRequestsService: JoinRequestsService,
    private notificationService: NotificationService,
    private orderService: OrderService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.order = "DESC";
    this.orderBy = "createdAt";
    this.getList();
  }

  private getList() {
    this.loading = true;
    this.joinRequestsService
      .getList(this.skip, this.limit, this.order, this.orderBy)
      .subscribe(
        res => {
          const resp = res.data.map(request => {
            return {
              id: request.id,
              email: request.account.email,
              name: `${request.account.firstName} ${request.account.lastName}`,
              createdAt: moment(request.createdAt).format("MM/DD/YYYY"),
              driverNumber: request.account.dlNumber,
              status: this.orderService.formatStatus(request.status)
            };
          });
          this.dataSource.data = resp;
          this.countRequests = res.count;
          this.loading = false;
        },
        () => {
          this.loading = false;
        }
      );
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
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row.id
      }`;
  }

  public changePage(event: PageEvent) {
    this.skip = event.pageIndex * this.limit;
    this.limit = event.pageSize;
    this.getList();
  }

  public acceptRequests() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "450px",
      data: {
        action: "Confirm Accept",
        description: "Are you sure you want to accept requests?",
        nameButton: "Confirm",
        reason: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.selection.clear();
        return;
      }
      this.acceptJoinRequests();
    });
  }

  public acceptJoinRequests() {
    const requests = this.selection.selected.map(invite => invite.id);
    this.joinRequestsService
      .bulkAction(requests, REQUESTS_STATUSES.accept.value)
      .subscribe(
        () => {
          this.dataSource.data = this.dataSource.data.map(data => {
            if (requests.includes(data.id)) {
              return { ...data, status: REQUESTS_STATUSES.accept.label };
            }
            return data;
          });
          this.notificationService.success("Success accept!");
          this.selection.clear();
        },
        () => {
          this.selection.clear();
        }
      );
  }

  public declineRequests() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "450px",
      data: {
        action: "Confirm Decline",
        description: "Are you sure you want to decline requests?",
        nameButton: "Confirm",
        reason: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.selection.clear();
        return;
      }
      this.declineInvite();
    });
  }

  public declineInvite() {
    const requests = this.selection.selected.map(invite => invite.id);
    this.joinRequestsService
      .bulkAction(requests, REQUESTS_STATUSES.decline.value)
      .subscribe(
        () => {
          this.dataSource.data = this.dataSource.data.map(data => {
            if (requests.includes(data.id)) {
              return { ...data, status: REQUESTS_STATUSES.decline.label };
            }
            return data;
          });
          this.notificationService.success("Success decline!");
          this.selection.clear();
        },
        () => {
          this.selection.clear();
        }
      );
  }

  public sortData(event) {
    this.orderBy = event.active;
    this.order = event.direction;
    this.getList();
  }
}
