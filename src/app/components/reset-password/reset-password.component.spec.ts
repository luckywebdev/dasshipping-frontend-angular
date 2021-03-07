import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, Observer } from 'rxjs';

import { APP_ROUTES } from '../../app.constants';
import { Mock_SuccessDTO } from '../../constants';
import { ResetPasswordResponse, ValidateResetPasswordTokenResponse } from '../../interfaces/models';
import { UserService } from '../../providers/user/user.service';
import { AuthComponent } from '../auth/auth.component';
import { ResetPasswordComponent } from './reset-password.component';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let userService: UserService;

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting());
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResetPasswordComponent, AuthComponent],
      imports: [
        RouterTestingModule.withRoutes(
          [{ path: APP_ROUTES.auth, component: AuthComponent }],
        ),
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [UserService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    component.route.snapshot.params['hash'] = 'test';
    userService = fixture.debugElement.injector.get(
      UserService,
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should data is empty', () => {
    component.data.controls.password.setValue('');
    component.data.controls.confirmPassword.setValue('');
    fixture.detectChanges();
    expect(component.data.valid).toBeFalsy();
  });

  it('should data valid', () => {
    component.data.controls.password.setValue('Register$1');
    component.data.controls.confirmPassword.setValue('Register$1');
    fixture.detectChanges();
    expect(component.data.valid).toBeTruthy();
  });

  it('should the password does not have a big letter', () => {
    component.data.controls.password.setValue('register$1');
    component.data.controls.confirmPassword.setValue('register$1');
    fixture.detectChanges();
    expect(component.data.valid).toBeFalsy();
  });

  it('should the password does not have a special character', () => {
    component.data.controls.password.setValue('Register1');
    component.data.controls.confirmPassword.setValue('Register1');
    fixture.detectChanges();
    expect(component.data.valid).toBeFalsy();
  });

  it('should the password does not have a number', () => {
    component.data.controls.password.setValue('Register$');
    component.data.controls.confirmPassword.setValue('Register$');
    fixture.detectChanges();
    expect(component.data.valid).toBeFalsy();
  });

  it('should set submit func to true', () => {
    component.submit();
    expect(component.submit).toBeTruthy();
  });

  it('should call the submit method', () => {
    fixture.detectChanges();
    spyOn(component, 'submit');
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('button')).nativeElement;
    el.click();
    expect(component.submit).toHaveBeenCalledTimes(0);
  });

  it('should disabled button is false', () => {
    component.data.controls.password.setValue('Register$1');
    component.data.controls.confirmPassword.setValue('Register$1');
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(el.disabled).toBe(false);
  });

  it('should disabled button is true', () => {
    component.data.controls.password.setValue('');
    component.data.controls.confirmPassword.setValue('');
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(el.disabled).toBe(true);
  });

  it('should disabled button is true whit not valid password', () => {
    component.data.controls.password.setValue('Register');
    component.data.controls.confirmPassword.setValue('Register');
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(el.disabled).toBe(true);
  });

  it('should call register method whit password is empty', () => {
    component.data.controls.password.setValue('');
    component.data.controls.confirmPassword.setValue('Register$1');

    fixture.detectChanges();
    expect(component.submit()).toBe(undefined);
  });

  it('should hash is empty', () => {
    component.route.snapshot.params['hash'] = '';
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
  });

  it('call userService validateResetPasswordToken', fakeAsync(() => {
    component.route.snapshot.params['hash'] = 'test';
    spyOn(userService, 'validateResetPasswordToken').and.returnValue(
      new Observable((observer: Observer<ValidateResetPasswordTokenResponse>) => {
        return observer.next({ success: true, roleId: 1 });
      }),
    );
    fixture.detectChanges();
    component.ngOnInit();
    tick();
    expect(userService.validateResetPasswordToken).toHaveBeenCalled();
  }));

  it('call userService validateResetPasswordToken error', fakeAsync(() => {
    component.route.snapshot.params['hash'] = 'test';
    spyOn(userService, 'validateResetPasswordToken').and.returnValue(
      new Observable((observer: Observer<HttpErrorResponse>) => {
        return observer.error({ error: { statusCode: 400 } });
      }),
    );
    fixture.detectChanges();
    component.ngOnInit();
    tick();
    expect(userService.validateResetPasswordToken).toHaveBeenCalled();
  }));

  it('call userService resetPassword', fakeAsync(() => {
    component.route.snapshot.params['hash'] = 'test';
    component.data.controls.password.setValue('Register$1');
    component.data.controls.confirmPassword.setValue('Register$1');

    spyOn(userService, 'resetPassword').and.returnValue(
      new Observable((observer: Observer<ResetPasswordResponse>) => {
        return observer.next(Mock_SuccessDTO);
      }),
    );
    fixture.detectChanges();
    component.submit();
    tick();
    expect(userService.resetPassword).toHaveBeenCalled();
  }));

  afterAll(() => {
    fixture.detectChanges();
    const elements = document.body.getElementsByClassName('.cdk-overlay-container');
    while (elements.length > 0) {
      elements[0].remove();
    }
    fixture.destroy();
  });
});
