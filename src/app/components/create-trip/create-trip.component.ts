import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ROLES_STATUS } from '../../enums';
import { AccountDTO, TripCreateRequest, TripEditRequest } from '../../interfaces/models';
import { LoadingService } from '../../providers/loading/loading.service';
import { TripService } from '../../providers/trip/trip.service';
import { UserService } from '../../providers/user/user.service';

interface DialogData {
  id?: number;
  orderIds?: number[];
  dispatcherId?: number;
  driverId?: number;
  name?: string;
}

@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.scss'],
})
export class CreateTripComponent implements OnInit {
  drivers: AccountDTO[] = [];
  limit = 10;
  skipDriver = 0;
  countDriver = 0;
  skipDispatcher = 0;
  countDispatcher = 0;
  currentUser: AccountDTO;
  roles = ROLES_STATUS;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private tripService: TripService,
    private loadingService: LoadingService,
    public dialogRef: MatDialogRef<CreateTripComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  dispatchers: AccountDTO[] = [this.userService.user];
  public dataForm = this.fb.group({
    name: new FormControl(''),
    dispatcherId: new FormControl(''),
    driverId: new FormControl(''),
  });

  ngOnInit() {
    this.currentUser = this.userService.user;
    this.getDrivers();
    if (this.currentUser.roleId !== ROLES_STATUS.DISPATCHER) {
      this.getDispatchers();
    } else {
      this.dataForm.controls.dispatcherId.setValue(this.currentUser.id);
    }
    const { dispatcherId, driverId, id } = this.data;
    if (id) {
      if (dispatcherId) {
        this.dataForm.controls.dispatcherId.setValue(this.data.dispatcherId);
      }
      if (driverId) {
        this.dataForm.controls.driverId.setValue(this.data.driverId);
      }
      this.dataForm.controls.dispatcherId.setValidators([Validators.required]);
    }
  }

  private getValue(key: string) {
    const value = this.dataForm.get(key).value;
    return parseInt(value, 10);
  }

  public checkTrip() {
    if (this.data.id) {
      this.editTrip();
    } else {
      this.createTrip();
    }
  }

  private editTrip() {
    this.loadingService.startLoading();
    const body: TripEditRequest = {
      dispatcherId: this.getValue('dispatcherId'),
      driverId: this.getValue('driverId') ? this.getValue('driverId') : null,
    };
    this.tripService.edit(this.data.id, body).subscribe(
      (res) => {
        this.dialogRef.close(res);
        this.loadingService.stopLoading();
      },
      () => {
        this.dialogRef.close();
      },
    );
  }

  private createTrip() {
    const { orderIds } = this.data;
    if (orderIds && orderIds.length) {
      this.loadingService.startLoading();
      const body: TripCreateRequest = {
        orderIds: this.data.orderIds,
        dispatcherId: this.getValue('dispatcherId'),
        driverId: this.getValue('driverId') ? this.getValue('driverId') : null,
      };
      this.tripService.create(body)
        .subscribe(
          (res) => {
            this.dialogRef.close(res);
            this.loadingService.stopLoading();
          },
          () => {
            this.dialogRef.close();
          },
        );
    }
  }

  private getDrivers() {
    this.userService
      .getList(this.skipDriver, this.limit, null, null, ROLES_STATUS.DRIVER)
      .subscribe((res) => {
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
        ROLES_STATUS.DISPATCHER,
      )
      .subscribe((res) => {
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
}
