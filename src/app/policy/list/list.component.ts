import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatSort, MatTableDataSource, Sort } from '@angular/material';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { PolicyComponent } from '../../components/policy/policy.component';
import { PolicyDTO } from '../../interfaces/models';
import { GeneralService } from '../../providers/general/general.service';
import { LoadingService } from '../../providers/loading/loading.service';
import { NotificationService } from '../../providers/notification/notification.service';
import { PolicyService } from '../../providers/policy/policy.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = ['type', 'price', 'actions'];
  dataSource = new MatTableDataSource<PolicyDTO>();
  @ViewChild(MatSort, {}) sort: MatSort;
  limit = 10;
  skip = 0;
  pageLimit = [5, 10];
  order: string;
  orderBy: string;
  countPrices = 0;
  loading = false;
  readonly = true;

  constructor(
    private fb: FormBuilder,
    private policyService: PolicyService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private loadingService: LoadingService,
    public dialog: MatDialog,
  ) { }

  public data = this.fb.group({
    minimumProfitPercentage: new FormControl('', [Validators.required]),
    recommendedProfitPercentage: new FormControl('', [Validators.required]),
    inopAdditionalPricePercentage: new FormControl('', [Validators.required]),
    enclosedAdditionalPricePercentage: new FormControl('', [Validators.required]),
    serviceAbsoluteFee: new FormControl('', [Validators.required]),
    minimalSalePrice: new FormControl('', [Validators.required]),
    creditCardPaymentFee: new FormControl('', [Validators.required]),
    achPaymentFee: new FormControl('', [Validators.required]),
    liftedPercentage: new FormControl('', [Validators.required]),
    headRackPercentage: new FormControl('', [Validators.required]),
    utilityBedPercentage: new FormControl('', [Validators.required]),
    handicapPercentage: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.getList();
    this.getGeneral();
  }

  public editMode() {
    this.readonly = !this.readonly;
  }

  private getList() {
    this.loading = true;
    this.policyService.getList(this.skip, this.limit, this.order, this.orderBy)
      .subscribe(
        (res) => {
          this.dataSource.data = res.data;
          this.countPrices = res.count;
          this.loading = false;
        },
        () => {
          this.loading = false;
        });
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

  public addPrice(policy: PolicyDTO = null) {
    const ref = this.dialog.open(PolicyComponent, {
      width: '450px',
      data: policy,
    });
    ref.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.upadateList(result);
        }
      });
  }

  public checkRemove(policy: PolicyDTO) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm Delete',
        description: 'Are you sure?',
        nameButton: 'Confirm',
        reason: false,
      },
    });
    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.remove(policy.id);
        }
      });
  }

  private remove(id: number) {
    this.policyService.delete(id)
      .subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter(policy => policy.id !== id);
        this.notificationService.success('Policy success deleted!');
      });
  }

  private upadateList(res: PolicyDTO) {
    this.dataSource.data = this.dataSource.data.filter(policy => policy.id !== res.id);
    this.dataSource.data = [res, ...this.dataSource.data];
  }

  private getGeneral() {
    this.generalService.get()
      .subscribe((res) => {
        this.setValueGeneral(res);
      });
  }

  private setValueGeneral(res) {
    Object.keys(res).forEach((key) => {
      if (this.data.controls[key] && res[key]) {
        this.data.controls[key].setValue(res[key]);
      }
    });
  }

  public saveGeneral() {
    this.loadingService.startLoading();
    this.generalService.update(this.data.value)
      .subscribe((res) => {
        this.notificationService.success('Success updated!');
        this.setValueGeneral(res);
        this.loadingService.stopLoading();
      });
    this.readonly = !this.readonly;
  }

  public syncPolicy() {
    this.loadingService.startLoading();
    this.policyService.sync()
      .subscribe(() => {
        this.notificationService.success('Success updated!');
        this.loadingService.stopLoading();
        this.getList();
      });
  }
}
