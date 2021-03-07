import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as moment from 'moment';

import { DispatchService } from '../../providers/dispatch/dispatch.service';
import { LoadingService } from '../../providers/loading/loading.service';
import { NotificationService } from '../../providers/notification/notification.service';
import { UserService } from '../../providers/user/user.service';

interface DialogData {
  id?: number;
  orderId: number;
  message: string;
  pickDate: string;
  deliveryDate: string;
}

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss'],
})
export class DispatchComponent implements OnInit {
  public message: string;
  constructor(
    private fb: FormBuilder,
    private dispatchService: DispatchService,
    private loadingService: LoadingService,
    private userService: UserService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<DispatchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  public dataForm = this.fb.group({
    orderId: new FormControl('', [Validators.required]),
    pickDate: new FormControl('', [Validators.required]),
    deliveryDate: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.setData();
  }

  private setData() {
    const { deliveryDate, pickDate, orderId, id } = this.data;
    const currentDate = moment().toISOString();
    this.dataForm.controls['orderId'].setValue(orderId);
    this.dataForm.controls['pickDate'].setValue(pickDate || currentDate, { disable: !!id });
    this.dataForm.controls['deliveryDate'].setValue(deliveryDate || currentDate, { disable: !!id });
  }

  private getValue(key: string) {
    return this.dataForm.get(key).value;
  }

  public checkDispatch() {
    this.loadingService.startLoading();
    if (this.data.id) {
      this.updateDispatch();
    } else {
      this.createDispatch();
    }
  }

  private updateDispatch() {
    this.dispatchService.update(this.data.id, {
      pickDate: this.userService.toIsoDate(this.getValue('pickDate')),
      deliveryDate: this.userService.toIsoDate(this.getValue('deliveryDate')),
    })
      .subscribe(
        (res) => {
          this.dialogRef.close(res);
          this.loadingService.stopLoading();
          this.notificationService.success('Success edited!');
        },
        () => {
          this.loadingService.stopLoading();
          this.dialogRef.close();
        });
  }

  private createDispatch() {
    this.dispatchService.create({
      orderId: this.getValue('orderId'),
      pickDate: this.userService.toIsoDate(this.getValue('pickDate')),
      deliveryDate: this.userService.toIsoDate(this.getValue('deliveryDate')),
    })
      .subscribe(
        (res) => {
          this.dialogRef.close(res);
          this.loadingService.stopLoading();
          this.notificationService.success('Success created!');
        },
        () => {
          this.loadingService.stopLoading();
          this.dialogRef.close();
        });
  }
}
