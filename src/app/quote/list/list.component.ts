import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource, Sort } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { APP_ROUTES } from '../../app.constants';
import { NewDiscountComponent } from '../../components/new-price/new-price.component';
import { QuoteDTO } from '../../interfaces/models';
import { NotificationService } from '../../providers/notification/notification.service';
import { OrderService } from '../../providers/order/order.service';
import { UserService } from '../../providers/user/user.service';

interface PeriodicElement {
  id: number;
  customerName: string;
  cargo: string;
  pickLocation: string;
  deliveryLocation: string;
  status: string;
  trailerType: string;
  price: string;
  discount: number;
  existNotify?: boolean;
  notifyIds: number[];
}
@Component({
  selector: 'app-quotes-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, {}) sort: MatSort;
  displayedColumns: string[] = ['id', 'customerName', 'cargo', 'pickLocation',
    'deliveryLocation', 'status', 'trailerType', 'price'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  limit = 10;
  skip = 0;
  pageLimit = [5, 10];
  order: string;
  orderBy: string;
  countQuotes = 0;
  loading = false;
  quoteSubscription: Subscription;

  constructor(
    private orderService: OrderService,
    private notificationService: NotificationService,
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getList();
    this.quoteSubscription = this.userService
      .updateQuote
      .subscribe(() => {
        this.getList(false);
      });
  }

  ngOnDestroy() {
    if (this.quoteSubscription) {
      this.quoteSubscription.unsubscribe();
    }
  }

  private createQuoteData(quote: QuoteDTO) {
    const { notifications } = quote;
    return {
      id: quote.id,
      customerName: `${quote.createdBy.firstName} ${quote.createdBy.lastName}`,
      cargo: quote.cars.map((car, index) => `${index + 1}. ${car.year} ${car.make} ${car.model} ${car.type}`).join('<br>'),
      pickLocation: this.orderService.fullAddress(quote.pickLocation),
      deliveryLocation: this.orderService.fullAddress(quote.deliveryLocation),
      status: quote.status.toUpperCase(),
      profit: this.orderService.formatPrice((quote.loadPrice || quote.priceWithDiscount) - quote.salePrice),
      price: this.orderService.formatPrice(quote.priceWithDiscount),
      trailerType: quote.trailerType,
      discount: quote.discount,
      existNotify: !!(notifications && notifications.length),
      notifyIds: notifications && notifications.length ? notifications.map(item => item.id) : [],
    };
  }

  private getList(loading = true) {
    this.loading = loading;
    this.orderService.getQouteList(this.skip, this.limit, this.order, this.orderBy)
      .subscribe(
        (res) => {
          const resp = res.data.map((quote: QuoteDTO) => {
            return this.createQuoteData(quote);
          });
          this.dataSource.data = resp;
          this.countQuotes = res.count;
          this.loading = false;
        },
        () => {
          this.loading = false;
        });
  }

  public goQuote(row: PeriodicElement) {
    if (row.notifyIds.length) {
      row.notifyIds.forEach((notifyId) => {
        this.notificationService.markAsViewed(notifyId)
          .subscribe(() => {
            this.userService.setUser('notificationQuotes', -1);
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
    this.router.navigateByUrl(`${APP_ROUTES.quote}/${row.id}`);
  }

  public changePage(event) {
    this.skip = event.pageIndex * this.limit;
    this.limit = event.pageSize;
    this.getList();
  }

  public sortData(event: Sort) {
    this.orderBy = event.active;
    this.order = event.direction;
    this.getList();
  }

  public newOfferDiscount(offer: PeriodicElement) {
    const dialogRef = this.dialog.open(NewDiscountComponent, {
      data: {
        id: offer.id,
      },
      width: '450px',
    });
    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.dataSource.data = this.dataSource.data.map((quote) => {
            if (quote.id === offer.id) {
              return this.createQuoteData(result);
            }
            return quote;
          });
        }
      });
  }
}
