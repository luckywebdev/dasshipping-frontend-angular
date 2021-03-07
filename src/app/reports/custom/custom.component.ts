import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ORDER_STATUSES } from '../../constants';
import { LoadingService } from '../../providers/loading/loading.service';
import { NotificationService } from '../../providers/notification/notification.service';
import { ReportsService } from '../../providers/reports/reports.service';

@Component({
  selector: 'app-custom',
  templateUrl: './custom.component.html',
  styleUrls: ['./custom.component.scss'],
})
export class CustomComponent {
  includes = [{ value: 'active', label: 'Active' }, { value: 'archived', label: 'Archived' }, { value: '', label: 'All Orders' }];
  assigned = [
    { value: 'all', label: 'All' },
    { value: 'all drivers', label: 'All drivers' },
    { value: 'all dispatchers', label: 'All dispatchers' },
    { value: 'no drivers', label: 'No drivers' },
    { value: 'no dispatcher', label: 'NO dispatchers' },
  ];
  orderByFields = [{ value: 'createdAt', label: 'Creation Date' }, { value: 'deliveryDate', label: 'Delivery Date' }];
  statuses = ORDER_STATUSES;
  emailAddress: string;

  constructor(
    private fb: FormBuilder,
    private reportsService: ReportsService,
    private notificationService: NotificationService,
    private loadingService: LoadingService,
    public dialog: MatDialog,
  ) { }

  public filter = this.fb.group({
    include: new FormControl(''),
    status: new FormControl(''),
    assignedTo: new FormControl(''),
    fromCreatedDate: new FormControl(''),
    toCreatedDate: new FormControl(''),
    fromDeliveryDate: new FormControl(''),
    toDeliveryDate: new FormControl(''),
    orderByDirection: new FormControl(''),
    orderByField: new FormControl(''),
  });

  public general = this.fb.group({
    importedOrderId: new FormControl(true),
    systemOrderId: new FormControl(true),
    cargo: new FormControl(true),
    vinNumbers: new FormControl(true),
    creationDate: new FormControl(true),
  });

  public pickupInfo = this.fb.group({
    date: new FormControl(true),
    name: new FormControl(true),
    address: new FormControl(true),
    city: new FormControl(true),
    state: new FormControl(true),
    zipCode: new FormControl(true),
    phone: new FormControl(true),
    email: new FormControl(true),
  });

  public deliveryInfo = this.fb.group({
    date: new FormControl(true),
    name: new FormControl(true),
    address: new FormControl(true),
    city: new FormControl(true),
    state: new FormControl(true),
    zipCode: new FormControl(true),
    phone: new FormControl(true),
    email: new FormControl(true),
  });

  public shipperInfo = this.fb.group({
    name: new FormControl(true),
    address: new FormControl(true),
    city: new FormControl(true),
    state: new FormControl(true),
    phone: new FormControl(true),
    zipCode: new FormControl(true),
    email: new FormControl(true),
  });

  public paymentInfo = this.fb.group({
    terms: new FormControl(true),
    status: new FormControl(true),
    amount: new FormControl(true),
    BrokerFee: new FormControl(true),
    method: new FormControl(true),
  });

  public clearFilters() {
    this.filter.reset();
  }

  public clearAll() {
    this.pickupInfo.reset();
    this.deliveryInfo.reset();
    this.general.reset();
    this.shipperInfo.reset();
    this.paymentInfo.reset();
  }

  public selectAll() {
    Object.keys(this.pickupInfo.value).forEach((key) => {
      this.pickupInfo.controls[key].setValue(true);
    });
    Object.keys(this.deliveryInfo.value).forEach((key) => {
      this.deliveryInfo.controls[key].setValue(true);
    });
    Object.keys(this.general.value).forEach((key) => {
      this.general.controls[key].setValue(true);
    });
    Object.keys(this.shipperInfo.value).forEach((key) => {
      this.shipperInfo.controls[key].setValue(true);
    });
    Object.keys(this.paymentInfo.value).forEach((key) => {
      this.paymentInfo.controls[key].setValue(true);
    });
  }

  public checkSendReport() {
    if (!this.emailAddress || !this.emailAddress.length) {
      this.notificationService.error('Enter email');
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm Send Report',
        description: 'Are you sure?',
        nameButton: 'Send',
        reason: false,
      },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.sendReport();
        }
      });
  }

  private sendReport() {
    this.loadingService.startLoading();
    const {
      include,
      status,
      fromCreatedDate,
      toCreatedDate,
      assignedTo,
      orderByField,
      fromDeliveryDate,
      toDeliveryDate } = this.filter.value;

    const filter = {
      include,
      status,
      assignedTo,
      orderByField,
      fromCreatedDate: fromCreatedDate ? moment(fromCreatedDate).toISOString() : null,
      toCreatedDate: toCreatedDate ? moment(toCreatedDate).toISOString() : null,
      fromDeliveryDate: fromDeliveryDate ? moment(fromDeliveryDate).toISOString() : null,
      toDeliveryDate: toDeliveryDate ? moment(toDeliveryDate).toISOString() : null,
    };
    this.reportsService.sendCustomReport(
      {
        general: this.general.value,
        pickupInfo: this.pickupInfo.value,
        deliveryInfo: this.deliveryInfo.value,
        shipperInfo: this.shipperInfo.value,
        paymentInfo: this.paymentInfo.value,
        emailAddress: this.emailAddress,
      },
      filter)
      .subscribe(() => {
        this.loadingService.stopLoading();
        this.notificationService.success('Sent successfully!');
      });
  }
}
