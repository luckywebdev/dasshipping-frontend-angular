import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ROLES_STATUS } from '../../enums';
import { AccountDTO } from '../../interfaces/models';
import { LoadingService } from '../../providers/loading/loading.service';
import { TripService } from '../../providers/trip/trip.service';
import { UserService } from '../../providers/user/user.service';

interface DialogData {
  id: number;
  accountId: number;
  role: number;
}

@Component({
  selector: 'app-assign-trip',
  templateUrl: './assign-trip.component.html',
  styleUrls: ['./assign-trip.component.scss'],
})
export class AssignToTripComponent implements OnInit {
  accounts: AccountDTO[] = [];
  limit = 10;
  skip = 0;
  count = 0;
  roles = ROLES_STATUS;
  roleDispetcher = ROLES_STATUS.DISPATCHER;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private tripService: TripService,
    private loadingService: LoadingService,
    public dialogRef: MatDialogRef<AssignToTripComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  public dataForm = this.fb.group({
    accountId: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.getAccounts();
    this.dataForm.controls.accountId.setValue(this.data.accountId);
  }

  private getValue(key: string) {
    const value = this.dataForm.get(key).value;
    return parseInt(value, 10);
  }

  public editTrip() {
    this.loadingService.startLoading();
    const { id, role } = this.data;
    let data = {};
    if (role === ROLES_STATUS.DISPATCHER) {
      data = {
        dispatcherId: this.getValue('accountId'),
      }
    } else {
      data = {
        driverId: this.getValue('accountId'),
      }
    }
    this.tripService.edit(id, data)
      .subscribe((res) => {
        this.dialogRef.close(res);
        this.loadingService.stopLoading();
      });
  }

  private getAccounts() {
    this.userService.getList(this.skip, this.limit, null, null, this.data.role)
      .subscribe((res) => {
        const drivers = res.data;
        this.accounts = [...this.accounts, ...drivers];
        this.count = res.count;
      });
  }

  public getListAccounts() {
    if (this.accounts.length < this.count) {
      this.skip = this.skip + this.limit;
      this.getAccounts();
    }
  }
}
