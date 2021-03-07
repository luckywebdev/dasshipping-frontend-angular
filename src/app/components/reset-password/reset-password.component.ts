import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { APP_ROUTES, INFO_MSG_PASSWORD, REGEX_PASSWORD } from '../../app.constants';
import { PasswordStateMatcher } from '../../error/password.matcher';
import { AccountDTO } from '../../interfaces/models';
import { AuthService } from '../../providers/auth/auth.service';
import { LoadingService } from '../../providers/loading/loading.service';
import { UserService } from '../../providers/user/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  matcher = new PasswordStateMatcher();
  hash: string;
  infoMessage: string;
  user: AccountDTO;

  data = this.fb.group(
    {
      password: new FormControl('', [Validators.required, this.validatePassword(REGEX_PASSWORD[3])]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validator: this.matchPassword });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private loadingService: LoadingService,
    public router: Router,
    public route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.loadingService.startLoading();
    this.user = this.userService.user;
    this.validateToken();
  }

  private validateToken() {
    this.hash = this.route.snapshot.paramMap.get('hash');
    if ((this.hash && this.hash.length) || (this.user && this.user.id)) {
      if (this.hash && this.hash.length) {
        this.userService.validateResetPasswordToken({ hash: this.hash })
          .subscribe(
            (res) => {
              this.loadingService.stopLoading();
              this.infoMessage = INFO_MSG_PASSWORD[res.roleId];
              this.data = this.fb.group(
                {
                  password: new FormControl('', [Validators.required, this.validatePassword(REGEX_PASSWORD[res.roleId])]),
                  confirmPassword: new FormControl('', [Validators.required]),
                },
                { validator: this.matchPassword });
            },
            () => {
              this.router.navigate([APP_ROUTES.auth]);
            });
      } else {
        this.loadingService.stopLoading();
      }
    } else {
      this.loadingService.stopLoading();
      this.router.navigate([APP_ROUTES.auth]);
    }
  }

  private matchPassword(group: FormGroup) {
    const password = group.controls.password.value;
    const confirmPassword = group.controls.confirmPassword.value;

    return password === confirmPassword ? null : { notSame: true };
  }

  private validatePassword(mediumRegex: RegExp) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return mediumRegex.test(control.value) ? null : { valid: true };
    };
  }

  public submit() {
    this.loadingService.startLoading();
    const { password } = this.data.value;
    if (this.user && this.user.id) {
      this.userService.updateMyProfile({ password })
        .subscribe(() => {
          this.authService.authLoginPost({
            password,
            email: this.user.email,
            noCheckRecapcha: true,
          })
            .subscribe(() => {
              this.loadingService.stopLoading();
              this.router.navigate([APP_ROUTES.orders]);
            });
        });
    } else {
      this.userService.resetPassword({ password, hash: this.hash })
        .subscribe(() => {
          this.loadingService.stopLoading();
          this.router.navigate([APP_ROUTES.auth]);
        });
    }
  }
}
