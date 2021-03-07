import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource, Sort } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { APP_ROUTES } from '../../app.constants';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { COMPANY_STATUSES } from '../../constants';
import { CompanyService } from '../../providers/company/company.service';
import { NotificationService } from '../../providers/notification/notification.service';
import { UserService } from '../../providers/user/user.service';

interface PeriodicElement {
  id: number;
  name: string;
  full_name: string;
  address: string;
  officePhone: string;
  email: string;
  status: string;
  existNotify: boolean;
  notifyIds: number[];
}

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
})
export class CompanyListComponent implements OnInit, OnDestroy {
  @Input() status: string;
  @Output() public changeCount: EventEmitter<number> = new EventEmitter();
  displayedColumns: string[] = ['select', 'name', 'full_name', 'address', 'email', 'status', 'officePhone'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatSort, {}) sort: MatSort;
  selection = new SelectionModel<PeriodicElement>(true, []);
  limit = 10;
  skip = 0;
  pageLimit = [5, 10];
  order: string;
  orderBy: string;
  countCompanies = 0;
  loading = false;
  companyStatuses = COMPANY_STATUSES;
  companySubscription: Subscription;

  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private router: Router,
    private notificationService: NotificationService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getList();

    this.companyService.changeRequested
      .subscribe(() => {
        this.getList();
      });
    this.companySubscription = this.userService
      .updateCompany
      .subscribe(() => {
        this.getList(false);
      });
  }

  ngOnDestroy() {
    if (this.companySubscription) {
      this.companySubscription.unsubscribe();
    }
  }

  private getList(loading = true) {
    this.loading = loading;
    this.companyService.getList({
      offset: this.skip,
      limit: this.limit,
      orderByField: this.orderBy,
      orderByDirection: this.order,
      status: this.status,
    })
      .subscribe(
        (res) => {
          const resp = res.data.map((company) => {
            const { notifications } = company;
            return {
              id: company.id,
              name: company.name,
              full_name: `${company.contactPersonFirstName} ${company.contactPersonLastName}`,
              address: company.address,
              officePhone: company.officePhone,
              email: company.email,
              status: company.status,
              existNotify: !!(notifications && notifications.length),
              notifyIds: notifications && notifications.length ? notifications.map(item => item.id) : [],
            };
          });
          this.dataSource.data = resp;
          this.countCompanies = res.count;
          this.changeCount.emit(this.countCompanies);
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

  public goCompany(row: PeriodicElement) {
    if (row.notifyIds.length) {
      row.notifyIds.forEach((notifyId) => {
        this.notificationService.markAsViewed(notifyId)
          .subscribe(() => {
            this.userService.setUser('notificationCompanies', -1);
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
    this.router.navigateByUrl(`${APP_ROUTES.company}/${row.id}`);
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

  public ckecBlockCompanies() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        action: 'Block Company Account',
        description: 'Are you sure?All company members will be notified and blocked to use the system.',
        nameButton: 'Block Account',
        reason: true,
        placeholder: 'Reason...',
        maxlength: 120,
      },
      width: '450px',
    });
    dialogRef.afterClosed()
      .subscribe((result) => {
        if (!result) {
          this.selection.clear();
          return;
        }
        this.blockCompanies(result);
      });
  }

  private blockCompanies(reason: string) {
    this.loading = true;
    const blockCompanies = this.selection.selected.map(user => user.id.toString());
    this.companyService.setBlock({ reason, ids: blockCompanies, blocked: true })
      .subscribe(
        () => {
          this.notificationService.success('Success blocked!');
          this.selection.clear();
          this.loading = false;
        },
        () => {
          this.selection.clear();
          this.loading = false;
        });
  }

  public sortData(event: Sort) {
    this.orderBy = event.active;
    this.order = event.direction;
    this.getList();
  }

  public checkApprove(company: PeriodicElement) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        action: 'Confirm Approve Company',
        description: 'Are you sure?',
        nameButton: 'Approve',
        reason: false,
      },
      width: '450px',
    });
    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.approveCompany(company.id);
        }
      });
  }

  private approveCompany(id: number) {
    this.loading = true;
    this.companyService.aproveCompany(id)
      .subscribe(
        () => {
          this.loading = false;
          this.companyService.changeRequested.emit();
          this.changeCount.emit(this.countCompanies - 1);
          this.notificationService.success('Success approved!');
        },
        () => {
          this.loading = false;
        });
  }

  public requestChanges(company: PeriodicElement) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        action: 'Request Changes',
        description: '',
        nameButton: 'Send',
        reason: true,
        placeholder: 'Changes...',
        maxlength: 400,
      },
      width: '450px',
    });
    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.companyService.requestChangesCompany({ id: company.id, message: result })
            .subscribe(() => {
              this.notificationService.success('Success send!');
            });
        }
      });
  }
}
