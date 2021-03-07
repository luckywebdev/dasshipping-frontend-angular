import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource, Sort } from '@angular/material';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';

import { APP_ROUTES } from '../../app.constants';
import { DispatchComponent } from '../../components/dispatch/dispatch.component';
import { TripPlannerComponent } from '../../components/trip-planner/trip-planner.component';
import { FilterDTO, OrderDTO } from '../../interfaces/models';
import { CompanyService } from '../../providers/company/company.service';
import { OrderService } from '../../providers/order/order.service';

interface PeriodicElement {
  id: number;
  companyId: number;
  pickLocation: string;
  deliveryLocation: string;
  cargo: string;
  shipper: string;
  trailerType: string;
  pickDate: string;
  deliveryDate: string;
  age: string;
  distance: number;
  action: boolean;
  labelGroup: string;
  uuid: string;
}
export interface Group {
  group: string;
  id: number;
}

@Component({
  selector: 'app-order-list-available',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListAvailableComponent implements OnInit {
  @Input() filter: Observable<FilterDTO>;
  @Input() planner: Observable<boolean>;
  @Output() public changeCount: EventEmitter<number> = new EventEmitter();
  @Output() public changeOpenPlanner: EventEmitter<boolean> = new EventEmitter();

  displayedColumns: string[] = ['select', 'id', 'pickLocation', 'distance',
    'deliveryLocation', 'cargo', 'shipper', 'trailerType', 'pickDate', 'age', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement | Group>();
  @ViewChild(MatSort, {}) sort: MatSort;
  selection = new SelectionModel<PeriodicElement>(true, []);
  selectionGroup = new SelectionModel<Group>(true, []);
  limit = 10;
  skip = 0;
  pageLimit = [5, 10];
  order: string;
  orderBy: string;
  countOrders = 0;
  loading = false;
  orders: OrderDTO[] = [];
  filters: any;
  grouped = false;

  constructor(
    private companyService: CompanyService,
    private orderService: OrderService,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getList();
    this.subscribeEvents();
  }

  public selectGroup(group: Group) {
    this.selectionGroup.toggle(group)
    const selecteds: any = this.dataSource.data.filter((item: PeriodicElement) => item.labelGroup === group.group);
    const selected = this.selectionGroup.selected.find(item => item.group === group.group);
    const visiblePlanner = !!this.selectionGroup.selected.length;
    this.changeOpenPlanner.emit(visiblePlanner);
    if (selected) {
      this.selection.select(...selecteds);
    } else {
      this.selection.deselect(...selecteds);
    }
  }

  public selectElement(row: PeriodicElement) {
    this.selection.toggle(row)
    const visiblePlanner = !!this.selection.selected.length;
    this.changeOpenPlanner.emit(visiblePlanner);
    if (this.grouped) {
      const selected = this.selection.selected.filter((item: PeriodicElement) => item.labelGroup === row.labelGroup);
      const ordersGroup = this.dataSource.data.filter((item: PeriodicElement) => item.labelGroup === row.labelGroup);
      const selectedGroup: any = this.dataSource.data.filter((item: Group) => item.group === row.labelGroup);
      if (selected.length === ordersGroup.length) {
        this.selectionGroup.select(...selectedGroup);
      } else {
        this.selectionGroup.deselect(...selectedGroup);
      }
    }
  }

  public isAllSelectedGroup() {
    const numSelected = this.selectionGroup.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  public checkboxLabelGroup(row?: Group): string {
    if (!row) {
      return `${this.isAllSelectedGroup() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionGroup.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  public checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  private subscribeEvents() {
    this.filter.subscribe((filter: FilterDTO) => {
      this.selection.clear();
      this.selectionGroup.clear();
      this.getList(filter);
    });

    this.planner.subscribe(() => {
      this.openPlanner();
    });

    this.orderService.changeRequested
      .subscribe(() => {
        this.getList();
      });
  }

  private openPlanner() {
    const orderIds = this.selection.selected.map(item => item.id);
    const orders: OrderDTO[] = this.orders.filter(item => orderIds.includes(item.id));
    if (orders && orders.length) {
      const dialogRef = this.dialog.open(TripPlannerComponent, {
        width: '80%',
        data: { orders, selectedTrip: null, tripDetails: false },
      });
      this.changeOpenPlanner.emit(false);
      this.selection.clear();
      this.selectionGroup.clear();
      dialogRef.afterClosed()
        .subscribe((result) => {
          if (result) {
            this.getList();
          }
        });
    }
  }

  private setOrder(order: OrderDTO, labelGroup: string = null) {
    const { shipper } = order;

    return {
      labelGroup,
      id: order.id,
      cargo: order.cars.map((car, index) => `${index + 1}. ${car.year} ${car.make} ${car.model} ${car.type}`).join('<br>'),
      pickLocation: this.orderService.fullAddress(order.pickLocation),
      deliveryLocation: this.orderService.fullAddress(order.deliveryLocation),
      pickDate: this.orderService.toFormatDate(order.pickDate),
      deliveryDate: this.orderService.toFormatDate(order.deliveryDate),
      shipper: shipper && shipper.companyName,
      age: moment(order.createdAt).fromNow(),
      distance: this.orderService.formatDistance(order.distance),
      price: order.salePrice ? this.orderService.formatPrice(order.salePrice) : '',
      trailerType: order.trailerType,
      action: true,
      companyId: order.companyId,
      uuid: `#${order.uuid}`,
    };
  }

  private groupeOrder(orders: OrderDTO[]) {
    const labelGroup = `${orders[0].pickLocation.city}-${orders[orders.length - 1].deliveryLocation.city}`;
    const orderMap = orders.map((order: OrderDTO) => {
      return this.setOrder(order, labelGroup);
    });
    return [{ group: labelGroup }, ...orderMap];
  }

  private getList(filters: FilterDTO = {}) {
    this.changeOpenPlanner.emit(false);
    this.loading = true;
    this.grouped = !!(filters.origin || filters.destination);
    this.companyService.getLoadBoard({
      ...filters,
      offset: this.skip,
      limit: this.limit,
      orderByField: this.orderBy,
      orderByDirection: this.order,
      grouped: this.grouped,
    })
      .subscribe(
        (res) => {
          let orderGroups: any = [];
          if (this.grouped) {
            this.orders = [];
            for (let i = 0; i < res.data.length; i++) {
              this.orders = [...this.orders, ...res.data[i]];
              orderGroups = [...orderGroups, ...(this.groupeOrder(res.data[i]))];
            }
          } else {
            this.orders = res.data;
            orderGroups = res.data.map((order: OrderDTO) => {
              return this.setOrder(order);
            });
          }
          this.dataSource.data = orderGroups;
          this.countOrders = res.count;
          this.changeCount.emit(this.countOrders);
          this.loading = false;
        },
        () => {
          this.loading = false;
        });
  }

  public isGroup(_index, item): boolean {
    return item.group;
  }

  public goOrder(row: PeriodicElement) {
    if (row && row.id && row.companyId) {
      this.router.navigateByUrl(`${APP_ROUTES.order}/${row.id}`);
    }
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

  public request(order: PeriodicElement) {
    const existOrder = this.orders.find(item => order.id === item.id);
    const options = {
      data: {
        orderId: existOrder.id,
        pickDate: existOrder.pickDate,
        deliveryDate: existOrder.deliveryDate,
        message: 'Create request dispatch',
      },
      width: '450px',
    };
    const dialogRef = this.dialog.open(DispatchComponent, options);
    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.dataSource.data = this.dataSource.data.filter((item: PeriodicElement) => item.id !== result.orderId);
          this.orderService.changeRequested.emit();
          this.changeCount.emit(this.countOrders - 1);
        }
      });
  }

}
