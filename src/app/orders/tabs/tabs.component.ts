import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { APP_ROUTES } from '../../app.constants';
import { ORDER_BY, PATH_ORDERS_TAB, TABS_ACTIVATED } from '../../constants';
import { ROLES_STATUS } from '../../enums';
import { AccountDTO } from '../../interfaces/models';
import { LoadingService } from '../../providers/loading/loading.service';
import { OrderService } from '../../providers/order/order.service';
import { UserService } from '../../providers/user/user.service';
import { MatDialog } from '@angular/material';
import { PdfPreviewComponent } from '../../components/pdf-preview/pdf-preview.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: "app-tabs",
  templateUrl: "./tabs.component.html",
  styleUrls: ["./tabs.component.scss"]
})
export class TabsComponent implements OnInit {
  public filterSubject: Subject<void> = new Subject<void>();
  searchText$ = new Subject<string>();
  public selectedTab = 0;
  counts = {
    publish: 0,
    assigned: 0,
    declined: 0,
    picked_up: 0,
    delivered: 0,
    claimed: 0,
    paid: 0,
    billed: 0,
    past_due: 0
  };
  drivers: AccountDTO[] = [];
  dispatchers: AccountDTO[] = [];
  limit = 10;
  skipDriver = 0;
  countDriver = 0;
  skipDispatcher = 0;
  countDispatcher = 0;
  orderBy = ORDER_BY;
  pathOrdersTab = PATH_ORDERS_TAB;
  @ViewChild("fileInput") fileInput;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private orderService: OrderService
  ) { }

  public filter = this.fb.group({
    searchText: new FormControl(""),
    dispatcherId: new FormControl(undefined),
    driverId: new FormControl(undefined),
    orderByField: new FormControl(undefined),
    shipperCompanyName: new FormControl(undefined)
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params["tab"]) {
        this.selectedTab = TABS_ACTIVATED[params["tab"]];
      }
      if (params && params["name"]) {
        this.filter.controls.shipperCompanyName.setValue(params["name"]);
      }
    });
    this.getDrivers();
    const { user } = this.userService;
    if (user && user.roleId !== ROLES_STATUS.DISPATCHER) {
      this.getDispatchers();
    }
    this.searchText$
      .pipe(
        debounceTime(600),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        if (!text.length || text.length > 2) {
          this.filterSubject.next(this.filter.value);
        }
      });
  }

  public search(text: string) {
    this.searchText$.next(text);
  }

  public getPermission() {
    const { user } = this.userService;
    return user && user.roleId === ROLES_STATUS.COMPANY_ADMIN;
  }

  public changeCount(count: number, key: string) {
    this.counts[key] = count;
  }

  public applyFilter() {
    this.filterSubject.next(this.filter.value);
  }

  private getDrivers() {
    this.userService
      .getList(this.skipDriver, this.limit, null, null, ROLES_STATUS.DRIVER)
      .subscribe(res => {
        const drivers = res.data;
        this.drivers = [...this.drivers, ...drivers];
        this.countDriver = res.count;
      });
  }

  public getListDrivers() {
    if (this.drivers.length < this.countDriver) {
      this.skipDriver = this.skipDriver + this.limit;
      this.getDrivers();
    }
  }

  private getDispatchers() {
    this.userService
      .getList(
        this.skipDispatcher,
        this.limit,
        null,
        null,
        ROLES_STATUS.DISPATCHER
      )
      .subscribe(res => {
        const dispatchers = res.data;
        this.dispatchers = [...this.dispatchers, ...dispatchers];
        this.countDriver = res.count;
      });
  }

  public getListDispatchers() {
    if (this.dispatchers.length < this.countDispatcher) {
      this.skipDispatcher = this.skipDispatcher + this.limit;
      this.getDispatchers();
    }
  }

  public importOrder(file: File) {
    if (!file) {
      return;
    }

    this.loadingService.startLoading();
    this.fileInput.nativeElement.value = null;
    this.orderService.importOrder(file).subscribe(async res => {
      await this.router.navigate([APP_ROUTES.order, res.id]);
      this.loadingService.stopLoading();
    });
  }
  public async newOrder() {
    await this.router.navigate([APP_ROUTES.new_order]);
  }

  public infoImport() {
    this.dialog.open(PdfPreviewComponent, {
      width: '450vw',
      data: {
        textHeader: `Info import Order`,
        link: `${environment.api}/pdf/Import_Dispatch_Info.pdf`,
        cancelButton: 'Close',
        textButton: null,
      },
    });
  }
}
