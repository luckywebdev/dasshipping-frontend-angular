import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { ROLES_STATUS } from '../../enums';
import { AccountDTO } from '../../interfaces/models';
import { UserService } from '../../providers/user/user.service';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss'],
})
export class JoinDriverComponent implements OnInit {
  drivers: AccountDTO[] = [];
  selectedDriver: number;
  limit = 10;
  skip = 0;
  count = 0;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<JoinDriverComponent>,
  ) { }

  ngOnInit() {
    this.getDrivers();
  }

  public getDrivers() {
    this.userService.getList(this.skip, this.limit, null, null, ROLES_STATUS.DRIVER)
      .subscribe((res) => {
        const drivers = res.data.map((driver) => {
          return { ...driver, full_name: `${driver.firstName} ${driver.lastName}` };
        });
        this.drivers = [...this.drivers, ...drivers];
        this.count = res.count;
      });
  }

  public selected() {
    this.dialogRef.close(this.selectedDriver);
  }

  public getList() {
    if (this.drivers.length < this.count) {
      this.skip = this.skip + this.limit;
      this.getDrivers();
    }
  }

}
