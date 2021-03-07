import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { APP_ROUTES } from '../../app.constants';
import { GeneralReportDTO } from '../../interfaces/models';
import { LoadingService } from '../../providers/loading/loading.service';
import { OrderService } from '../../providers/order/order.service';
import { ReportsService } from '../../providers/reports/reports.service';

interface PeriodicElement {
  totalRevenue: string;
  totalPaid: string;
  totalDue: string;
  pastDue: string;
  companyName: string;
}

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.scss'],
})
export class RevenueComponent implements OnInit {
  displayedColumns: string[] = ['name', 'totalRevenue', 'totalPaid', 'totalDue', 'pastDue'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  generalReports: GeneralReportDTO;
  limit = 10;
  skip = 0;
  pageLimit = [5, 10];
  countRevenue = 0;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private reportService: ReportsService,
    private orderService: OrderService,
    private loadingService: LoadingService,
  ) { }

  public filter = this.fb.group({
    fromDeliveryDate: new FormControl(''),
    toDeliveryDate: new FormControl(''),
    searchText: new FormControl(''),
  });

  ngOnInit() {
    this.loadingService.startLoading();
    this.getGeneralReports();
    this.getRevenueReports();
  }

  private getGeneralReports() {
    this.reportService.getGeneral()
      .subscribe((res) => {
        this.generalReports = {
          ...res,
          totalRevenue: this.orderService.formatPrice(res.totalRevenue),
          totalDue: this.orderService.formatPrice(res.totalDue),
          totalPastDue: this.orderService.formatPrice(res.totalPastDue),
          totalPaid: this.orderService.formatPrice(res.totalPaid),
        };
        this.loadingService.stopLoading();
      });
  }

  private getRevenueReports(filter: {
    fromDeliveryDate?: string;
    toDeliveryDate?: string;
    searchText?: string;
  } = {}) {
    this.loading = true;
    this.reportService.getRevenue({
      ...filter,
      limit: this.limit,
      offset: this.skip,
    })
      .subscribe(
        (res) => {
          this.countRevenue = res.count;
          this.dataSource.data = res.data.map((item) => {
            return {
              totalRevenue: `$${this.orderService.formatPrice(item.totalRevenue)}`,
              totalPaid: `$${this.orderService.formatPrice(item.totalPaid)}`,
              totalDue: `$${this.orderService.formatPrice(item.totalDue)}`,
              pastDue: `$${this.orderService.formatPrice(item.totalPastDue)}`,
              companyName: item.shipper_companyName,
            };
          });
          this.loading = false;
        },
        () => {
          this.loading = false;
        });
  }

  public changePage(event) {
    this.skip = event.pageIndex * this.limit;
    this.limit = event.pageSize;
    this.getRevenueReports();
  }

  public search() {
    const { fromDeliveryDate, toDeliveryDate, searchText } = this.filter.value;
    const filter = {
      searchText,
      fromDeliveryDate: fromDeliveryDate ? moment(fromDeliveryDate).toISOString() : null,
      toDeliveryDate: toDeliveryDate ? moment(toDeliveryDate).toISOString() : null,
    };
    this.getRevenueReports(filter);
  }

  public viewOrders(companyName: string, tab: string) {
    this.router.navigate([APP_ROUTES.orders, APP_ROUTES.list], { queryParams: { tab, name: companyName } });
  }
}
