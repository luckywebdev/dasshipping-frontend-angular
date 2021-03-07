import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { APP_ROUTES } from '../../app.constants';
import { LoginResponse } from '../../interfaces/models';
import { AuthService } from '../../providers/auth/auth.service';
import { LoadingService } from '../../providers/loading/loading.service';
import { UserService } from '../../providers/user/user.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private loadingService: LoadingService,
    private recaptchaV3Service: ReCaptchaV3Service,
  ) {
  }

  @Output() public changeTab: EventEmitter<number> = new EventEmitter();

  public data = {
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required,
    ]),
    remember: false,
  };

  private validateKeys(keys: string[]): boolean {
    return keys.some(key => !this.data[key].valid);
  }

  public validateFields() {
    return this.validateKeys(['email', 'password']);
  }

  public goRegister() {
    this.changeTab.emit(1);
  }

  public login() {
    if (this.validateFields()) {
      return;
    }
    if (environment.recatchaEnabled) {
      this.recaptchaV3Service.execute('login')
        .subscribe(this.doLogin.bind(this));
      return;
    }
    this.doLogin();
  }

  private doLogin(token?: string) {
    this.loadingService.startLoading();
    this.authService.authLoginPost({
      token,
      email: this.data.email.value,
      password: this.data.password.value,
    })
      .subscribe((res: LoginResponse) => {
        this.userService.setTokens(res, this.data.remember);
        this.loadingService.stopLoading();
        this.router.navigate([APP_ROUTES.orders]);
      });
  }

  public rememberMe(event) {
    this.data.remember = event.checked;
  }
}
