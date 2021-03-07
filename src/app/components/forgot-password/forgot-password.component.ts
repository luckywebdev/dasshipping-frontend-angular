import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { SNACK_BAR } from '../../app.constants';
import { LoadingService } from '../../providers/loading/loading.service';
import { UserService } from '../../providers/user/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  public email = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  public success = false;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private loadingService: LoadingService) { }

  ngOnInit() {
  }

  public forgot() {
    if (!this.email.valid) {
      return;
    }
    this.loadingService.startLoading();
    this.userService.userForgotPasswordPost({ email: this.email.value })
      .subscribe(
        () => {
          this.loadingService.stopLoading();
          this.snackBar.open('Sent successfully!', '', SNACK_BAR.success);
          this.success = true;
        },
        () => {
          this.snackBar.open('This email does not exist!', '', SNACK_BAR.error);
        });
  }
}
