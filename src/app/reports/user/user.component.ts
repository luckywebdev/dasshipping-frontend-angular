import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import * as moment from 'moment';

import { SendEmailComponent } from '../../components/send-email/send-email.component';
import { ROLES } from '../../constants';
import { ROLES_STATUS } from '../../enums';
import { GeneralReportDTO } from '../../interfaces/models';
import { LoadingService } from '../../providers/loading/loading.service';
import { NotificationService } from '../../providers/notification/notification.service';
import { OrderService } from '../../providers/order/order.service';
import { ReportsService } from '../../providers/reports/reports.service';

interface PeriodicElement {
  name: string;
  payRate: string;
  grossRevenue: string;
  toPay: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  displayedColumns: string[] = ['name', 'payRate', 'grossRevenue', 'toPay'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  generalReports: GeneralReportDTO;
  limit = 10;
  skip = 0;
  pageLimit = [5, 10];
  countReports = 0;
  loading = false;
  roles = [
    { value: ROLES_STATUS.DISPATCHER, label: ROLES[ROLES_STATUS.DISPATCHER] },
    { value: ROLES_STATUS.DRIVER, label: ROLES[ROLES_STATUS.DRIVER] },
  ];

  constructor(
    private fb: FormBuilder,
    private reportService: ReportsService,
    private orderService: OrderService,
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
  ) { }

  public filter = this.fb.group({
    fromDeliveryDate: new FormControl(''),
    toDeliveryDate: new FormControl(''),
    role: new FormControl(''),
    deliveredOnly: new FormControl(''),
  });

  ngOnInit() {
    this.loadingService.startLoading();
    this.getReports();
  }

  private getReports(filter: {
    fromDeliveryDate?: string;
    toDeliveryDate?: string;
    deliveredOnly?: boolean;
    role?: number;
  } = {}) {
    this.loading = true;
    this.reportService.getReportsByUser({
      ...filter,
      limit: this.limit,
      offset: this.skip,
    })
      .subscribe(
        (res) => {
          this.countReports = res.count;
          this.dataSource.data = res.data.map((item) => {
            return {
              name: `${item.firstName} ${item.lastName}`,
              payRate: `${item.payRate}%`,
              grossRevenue: `$${this.orderService.formatPrice(item.grossRevenue)}`,
              toPay: `$${this.orderService.formatPrice(item.toPay)}`,
            };
          });
          this.loading = false;
          this.loadingService.stopLoading();
        },
        () => {
          this.loading = false;
        });
  }

  public changePage(event) {
    this.skip = event.pageIndex * this.limit;
    this.limit = event.pageSize;
    this.getReports();
  }

  public search() {
    const { fromDeliveryDate, toDeliveryDate, role, deliveredOnly } = this.filter.value;
    const filter = {
      deliveredOnly,
      fromDeliveryDate: fromDeliveryDate ? moment(fromDeliveryDate).toISOString() : null,
      toDeliveryDate: toDeliveryDate ? moment(toDeliveryDate).toISOString() : null,
      role: role ? role : null,
    };
    this.getReports(filter);
  }

  public downloadReports() {
    const dialogRef = this.dialog.open(SendEmailComponent, {
      width: '450px',
      data: {
        textHeader: 'Confirm download report',
        textButton: 'Send',
        checkDate: false,
      },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.downloadReportsUsers(result.email);
        }
      });
  }

  private downloadReportsUsers(email: string) {
    this.loadingService.startLoading();
    const { fromDeliveryDate, toDeliveryDate, role, deliveredOnly } = this.filter.value;
    const filter = {
      deliveredOnly,
      fromDeliveryDate: fromDeliveryDate ? moment(fromDeliveryDate).toISOString() : null,
      toDeliveryDate: toDeliveryDate ? moment(toDeliveryDate).toISOString() : null,
      role: role ? role : null,
    };
    this.reportService.dowloadReportsByUser({ filter, email })
      .subscribe(() => {
        this.loadingService.stopLoading();
        this.notificationService.success('Sent successfully!');
      });
  }

}
