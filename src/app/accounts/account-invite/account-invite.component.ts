import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { ROLES } from '../../constants';
import { ROLES_STATUS } from '../../enums/roles-status.enum';
import { AccountDTO } from '../../interfaces/models';
import { LoadingService } from '../../providers/loading/loading.service';
import { RegisterService } from '../../providers/register/register.service';
import { UserService } from '../../providers/user/user.service';

@Component({
  selector: 'app-account-invite',
  templateUrl: './account-invite.component.html',
  styleUrls: ['./account-invite.component.scss'],
})
export class AccountInviteComponent implements OnInit {
  curentAccount: AccountDTO;
  public roles = [
    ROLES_STATUS.DISPATCHER,
    ROLES_STATUS.ACCOUNTANT,
    ROLES_STATUS.DRIVER,
  ];

  public rolesName = ROLES;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private userService: UserService,
    private loadingService: LoadingService,
    public dialogRef: MatDialogRef<AccountInviteComponent>,
  ) { }

  public data = this.fb.group({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    roleId: new FormControl('', [Validators.required]),
  });

  private getValue(key) {
    return this.data.get(key).value;
  }

  ngOnInit() {
    this.curentAccount = this.userService.user;
    if (this.curentAccount.roleId === ROLES_STATUS.SUPER_ADMIN) {
      this.roles = [ROLES_STATUS.AGENT];
    }
  }

  public invite() {
    this.loadingService.startLoading();
    const data = {
      firstName: this.getValue('firstName'),
      lastName: this.getValue('lastName'),
      email: this.getValue('email'),
      roleId: this.getValue('roleId'),
    };
    this.registerService.inviteAccount(data)
      .subscribe(
        (res) => {
          this.dialogRef.close(res);
          this.loadingService.stopLoading();
        },
        () => {
          this.loadingService.stopLoading();
        });
  }
}
