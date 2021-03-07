import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { APP_ROUTES } from '../../app.constants';
import { PasswordStateMatcher } from '../../error/password.matcher';
import { ErrorService } from '../../providers/error/error.service';
import { LoadingService } from '../../providers/loading/loading.service';
import { RegisterService } from '../../providers/register/register.service';
import {ReCaptchaV3Service} from 'ng-recaptcha';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-register-common',
  templateUrl: './register-common.component.html',
  styleUrls: ['./register-common.component.scss'],
})
export class RegisterCommonComponent implements OnInit {
  private hash: string;

  matcher = new PasswordStateMatcher();

  public data = this.fb.group(
    {
      email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
      firstName: new FormControl({ value: '', disabled: true }, [Validators.required]),
      lastName: new FormControl({ value: '', disabled: true }, [Validators.required]),
      password: new FormControl('', [Validators.required, this.validatePassword]),
      confirmPassword: new FormControl('', [Validators.required]),
      terms: new FormControl(false, [Validators.requiredTrue]),
    },
    { validator: this.matchPassword });

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    public route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private errorService: ErrorService,
    private recaptchaV3Service: ReCaptchaV3Service,
  ) { }

  ngOnInit() {
    const hash = this.route.snapshot.paramMap.get('hash');
    this.loadHash(hash);
  }

  private loadHash(hash) {
    this.hash = hash;
    this.loadingService.startLoading();
    this.registerService.validateToken({ hash })
      .subscribe(
        (res) => {
          this.data.controls.email.setValue(res.invite.email);
          this.data.controls.firstName.setValue(res.invite.firstName);
          this.data.controls.lastName.setValue(res.invite.lastName);
          this.loadingService.stopLoading();
        },
        (err) => {
          this.errorService.navigate(err);
          this.loadingService.stopLoading();
        });
  }

  private validatePassword(control: AbstractControl) {
    const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/g;
    return mediumRegex.test(control.value) ? null : { valid: true };
  }

  private matchPassword(group: FormGroup) {
    const password = group.controls.password.value;
    const confirmPassword = group.controls.confirmPassword.value;

    return password === confirmPassword ? null : { notSame: true };
  }

  private validateKeys(keys: string[]): boolean {
    return keys.some(key => !this.data.get(key).valid);
  }

  public validateFields() {
    return this.validateKeys(['password', 'confirmPassword']);
  }

  private getValue(key) {
    return this.data.get(key).value;
  }

  public register() {
    if (environment.recatchaEnabled) {
      this.recaptchaV3Service.execute('register_carrier')
        .subscribe(this.doRegister.bind(this));
      return;
    }
    this.doRegister();
  }

  public doRegister(token?: string) {
    this.loadingService.startLoading();
    const data = {
      token,
      password: this.getValue('password'),
      hash: this.hash,
    };

    this.registerService.common(data)
      .subscribe(() => {
        this.loadingService.stopLoading();
        this.router.navigate([APP_ROUTES.auth]);
      });
  }

}
