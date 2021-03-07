import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PasswordStateMatcher } from '../../error/password.matcher';
import { ErrorService } from '../../providers/error/error.service';
import { LoadingService } from '../../providers/loading/loading.service';
import { UserService } from '../../providers/user/user.service';

@Component({
  selector: 'app-register-carrier-finish',
  templateUrl: './register-carrier-finish.component.html',
  styleUrls: ['./register-carrier-finish.component.scss'],
})
export class RegisterCarrierFinishComponent implements OnInit {
  matcher = new PasswordStateMatcher();

  public data = this.fb.group(
    {
      password: new FormControl('', [Validators.required, this.validatePassword]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validator: this.matchPassword });

  private hash;
  validPassword = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public route: ActivatedRoute,
    private loadingService: LoadingService,
    private errorService: ErrorService,
    private router: Router,
  ) { }

  ngOnInit() {
    const hash = this.route.snapshot.paramMap.get('hash');
    this.hash = hash;
    this.validateToken(hash);
  }

  private validateToken(hash: string) {
    this.loadingService.startLoading();
    this.userService.validateResetPasswordToken({ hash }).subscribe(
      () => {
        this.loadingService.stopLoading();
      },
      (err) => {
        this.errorService.navigate(err);
        this.loadingService.stopLoading();
      });
  }

  private matchPassword(group: FormGroup) {
    const password = group.controls.password.value;
    const confirmPassword = group.controls.confirmPassword.value;

    return password === confirmPassword ? null : { notSame: true };
  }

  private validatePassword(control: AbstractControl) {
    const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{12,})/g;
    return mediumRegex.test(control.value) ? null : { valid: true };
  }

  private getValue(key) {
    return this.data.get(key).value;
  }

  public formValidator() {
    this.validPassword = false;
  }

  validateFields() {
    const validPassword = ['confirmPassword', 'password'].some(key => this.data.get(key).disabled ? false : !this.data.get(key).valid);
    const password = this.getValue('password');
    const confirmPassword = this.getValue('confirmPassword');
    return !(password === confirmPassword) || validPassword;
  }

  public submit() {
    this.validPassword = this.validateFields();
    if (this.validPassword) {
      return;
    }
    const password = this.getValue('password');
    this.loadingService.startLoading();

    this.userService.resetPassword({ password, hash: this.hash })
      .subscribe(
        () => {
          this.loadingService.stopLoading();
          this.router.navigateByUrl('/auth');
        },
        () => {
          this.loadingService.stopLoading();
        });
    return;

  }
}
