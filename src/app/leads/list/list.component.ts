import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource, Sort } from '@angular/material';
import * as moment from 'moment';
import { Observable } from 'rxjs';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { EditCarComponent } from '../../components/edit-car/edit-car.component';
import { NewDiscountComponent } from '../../components/new-price/new-price.component';
import { FilterDTO, QuoteDTO } from '../../interfaces/models';
import { LeadService } from '../../providers/leads/lead.service';
import { LoadingService } from '../../providers/loading/loading.service';
import { OrderService } from '../../providers/order/order.service';

interface PeriodicElement {
  id: number;
  pickLocation: string;
  deliveryLocation: string;
  cargo: string;
  shipper: string;
  age: string;
  carType: string;
  distance: number;
  action: boolean;
  sentCount: number;
  discount: number;
  profit: string;
  notes: string;
}

@Component({
  selector: 'app-leads-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @Input() filter: Observable<FilterDTO>;
  @Input() status: string;
  @Output() public changeCount: EventEmitter<number> = new EventEmitter();

  displayedColumns: string[] = [
    'select',
    'id',
    'pickLocation',
    'distance',
    'deliveryLocation',
    'cargo',
    'shipper',
    'notes',
    'action',
  ];
  dataSource = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatSort, {}) sort: MatSort;
  selection = new SelectionModel<PeriodicElement>(true, []);
  limit = 10;
  skip = 0;
  pageLimit = [5, 10];
  order: string;
  orderBy: string;
  countLeads = 0;
  loading = false;
  isGroup: boolean;
  leads: QuoteDTO[] = [];
  filters: any;

  constructor(
    private leadService: LeadService,
    private orderService: OrderService,
    private loadingService: LoadingService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getList();
    this.subscribeEvents();
  }

  private subscribeEvents() {
    this.filter.subscribe((filter: FilterDTO) => {
      this.selection.clear();
      this.getList(filter);
    });
    this.leadService.changeRequested.subscribe(() => {
      this.getList();
    });
  }

  private setOrder(lead: QuoteDTO) {
    const { customer } = lead;
    return {
      id: lead.id,
      // tslint:disable-next-line: max-line-length
      cargo: lead.cars.map((car, index) => `${index + 1}. ${car.year} ${car.make} ${car.model ? `${car.model}` : ''}  ${car.type ? `${car.type}` : ''}`).join('<br>'),
      carType: lead.cars && lead.cars.length ? lead.cars[0].type : null,
      pickLocation: this.orderService.fullAddress(lead.pickLocation),
      deliveryLocation: this.orderService.fullAddress(lead.deliveryLocation),
      shipper: `${customer.firstName} ${customer.lastName} <br>
      Email: ${customer.email}`,
      age: moment(lead.createdAt).fromNow(),
      distance: this.orderService.formatDistance(lead.distance),
      action: true,
      sentCount: lead.sentCount,
      discount: lead.discount,
      price: this.orderService.formatPrice(lead.priceWithDiscount),
      profit: this.orderService.formatPrice(
        (lead.loadPrice || lead.priceWithDiscount) - lead.salePrice,
      ),
      notes: lead.notes,
    };
  }

  private getList(filters: FilterDTO = {}) {
    this.loading = true;
    this.leadService
      .getList({
        ...filters,
        offset: this.skip,
        limit: this.limit,
        orderByField: this.orderBy,
        orderByDirection: this.order,
      }, this.status)
      .subscribe(
        (res) => {
          this.loading = false;
          const leads = res.data.map((lead: QuoteDTO) => {
            return this.setOrder(lead);
          });
          this.dataSource.data = leads;
          this.leads = res.data;
          this.countLeads = res.count;
          this.changeCount.emit(this.countLeads);
        },
        () => {
          this.loading = false;
        }
      );
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

  public addNote(lead: PeriodicElement) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Lead notes',
        description: '',
        nameButton: 'Save',
        reason: true,
        placeholder: 'Notes',
        maxlength: 120,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadingService.startLoading();
        this.leadService.editLead(lead.id, { notes: result }).subscribe(() => {
          this.loadingService.stopLoading();
        });
      }
    });
  }

  public completCar(lead: PeriodicElement) {
    const getLead = this.leads.find(item => item.id === lead.id);
    const [car] = getLead.cars;
    const dialogRef = this.dialog.open(EditCarComponent, {
      width: '600px',
      data: {
        car,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getList();
      }
    });
  }

  public sentEmail(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm Sent',
        description: 'Are you sure?',
        nameButton: 'Confirm',
        reason: false,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.callSendRequest([id]);
      }
    });
  }

  private callSendRequest(ids: number[]) {
    this.loadingService.startLoading();
    this.leadService.sendEmail(ids).subscribe(() => {
      this.loadingService.stopLoading();
      this.selection.clear();
      this.leadService.changeRequested.emit();
    });
  }

  public sendEmails() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm Sent',
        description: 'Are you sure?',
        nameButton: 'Confirm',
        reason: false,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.selection.clear();
        return;
      }
      const leadIds = this.selection.selected.map(item => item.id);
      this.callSendRequest(leadIds);
    });
  }

  public deleteLeads() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm Delete',
        description: 'Are you sure?',
        nameButton: 'Confirm',
        reason: false,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.selection.clear();
        return;
      }
      const leadIds = this.selection.selected.map(item => item.id);
      this.loadingService.startLoading();
      this.leadService.delete(leadIds).subscribe(() => {
        this.loadingService.stopLoading();
        this.selection.clear();
        this.leadService.changeRequested.emit();
      });
    });
  }

  public newOfferDiscount(offer: PeriodicElement) {
    const dialogRef = this.dialog.open(NewDiscountComponent, {
      data: {
        id: offer.id,
      },
      width: '450px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.data = this.dataSource.data.map(quote => {
          if (quote.id === offer.id) {
            return this.setOrder(result);
          }
          return quote;
        });
      }
    });
  }
}
