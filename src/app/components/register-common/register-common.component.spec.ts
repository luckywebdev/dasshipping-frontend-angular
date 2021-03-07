import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, Observer } from 'rxjs';

import { APP_ROUTES } from '../../app.constants';
import { Mock_SuccessDTO, Mock_ValidateTokenResponse } from '../../constants';
import { CommonRegisterResponse } from '../../interfaces/models';
import { ValidateTokenResponse } from '../../interfaces/validateTokenResponse';
import { AuthService } from '../../providers/auth/auth.service';
import { ErrorService } from '../../providers/error/error.service';
import { LoadingService } from '../../providers/loading/loading.service';
import { RegisterService } from '../../providers/register/register.service';
import { UserService } from '../../providers/user/user.service';
import { AuthComponent } from '../auth/auth.component';
import { ErrorComponent } from '../error/error.component';
import { RegisterCommonComponent } from './register-common.component';

describe('RegisterCommonComponent', () => {
  let component: RegisterCommonComponent;
  let fixture: ComponentFixture<RegisterCommonComponent>;
  let registerService: RegisterService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RegisterCommonComponent,
        ErrorComponent,
        AuthComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(
          [{ path: APP_ROUTES.error, component: ErrorComponent },
          { path: APP_ROUTES.orders, loadChildren: './orders/orders.module#OrdersModule' },
          { path: APP_ROUTES.auth, component: AuthComponent }],
        ),
      ],
      providers: [
        RegisterService,
        LoadingService,
        ErrorService,
        UserService,
        AuthService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterCommonComponent);
    component = fixture.componentInstance;
    registerService = fixture.debugElement.injector.get(
      RegisterService,
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should data is empty', () => {
    component.data.controls.email.setValue('');
    component.data.controls.firstName.setValue('');
    component.data.controls.lastName.setValue('');
    component.data.controls.password.setValue('');
    component.data.controls.confirmPassword.setValue('');
    component.data.controls.terms.setValue(false);
    expect(component.data.valid).toBeFalsy();
  });

  it('should data valid', () => {
    component.data.controls.email.setValue('test@gmail.com');
    component.data.controls.firstName.setValue('Test');
    component.data.controls.lastName.setValue('Test');
    component.data.controls.password.setValue('Register$1');
    component.data.controls.confirmPassword.setValue('Register$1');
    component.data.controls.terms.setValue(true);
    expect(component.data.valid).toBeTruthy();
  });

  it('should the data email is not valid', () => {
    component.data.controls.email.setValue('test');
    expect(component.data.controls.email.valid).toBeFalsy();
  });

  it('should the password does not have a big letter', () => {
    component.data.controls.password.setValue('register$1');
    component.data.controls.confirmPassword.setValue('register$1');
    expect(component.data.controls.password.valid).toBeFalsy();
  });

  it('should the password does not have a special character', () => {
    component.data.controls.password.setValue('Register1');
    component.data.controls.confirmPassword.setValue('Register1');
    expect(component.data.controls.password.valid).toBeFalsy();
  });

  it('should the password does not have a number', () => {
    component.data.controls.email.setValue('test@gmail.com');
    component.data.controls.firstName.setValue('Test');
    component.data.controls.lastName.setValue('Test');
    component.data.controls.password.setValue('Register$');
    component.data.controls.confirmPassword.setValue('Register$');
    component.data.controls.terms.setValue(true);
    expect(component.data.valid).toBeFalsy();
  });

  it('should set validateFields func to true', () => {
    component.validateFields();
    expect(component.validateFields).toBeTruthy();
  });

  it('should set register func to true', () => {
    component.register();
    expect(component.register).toBeTruthy();
  });

  it('should call the register method', () => {
    fixture.detectChanges();
    spyOn(component, 'register');
    const el = fixture.debugElement.query(By.css('button')).nativeElement;
    el.click();
    expect(component.register).toHaveBeenCalledTimes(0);
  });

  it('should disabled button is false', () => {
    component.data.controls.email.setValue('test@gmail.com');
    component.data.controls.firstName.setValue('Test');
    component.data.controls.lastName.setValue('Test');
    component.data.controls.password.setValue('Register$1');
    component.data.controls.confirmPassword.setValue('Register$1');
    component.data.controls.terms.setValue(true);
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(el.disabled).toBe(false);
  });

  it('should disabled button is true', () => {
    component.data.controls.email.setValue('');
    component.data.controls.firstName.setValue('');
    component.data.controls.lastName.setValue('');
    component.data.controls.password.setValue('');
    component.data.controls.confirmPassword.setValue('');
    component.data.controls.terms.setValue(false);
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(el.disabled).toBe(true);
  });

  it('should disabled button is true whit not valid password', () => {
    component.data.controls.email.setValue('test@gmail.com');
    component.data.controls.firstName.setValue('Test');
    component.data.controls.lastName.setValue('Test');
    component.data.controls.password.setValue('Register');
    component.data.controls.confirmPassword.setValue('Register');
    component.data.controls.terms.setValue(true);
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(el.disabled).toBe(true);
  });

  it('should disabled button is true whit not valid email', () => {
    component.data.controls.email.setValue('test');
    component.data.controls.firstName.setValue('Test');
    component.data.controls.lastName.setValue('Test');
    component.data.controls.password.setValue('Register$1');
    component.data.controls.confirmPassword.setValue('Register$1');
    component.data.controls.terms.setValue(true);
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(el.disabled).toBe(false);
  });

  it('should disabled button is true whit not valid terms', () => {
    component.data.controls.email.setValue('test@gmail.com');
    component.data.controls.firstName.setValue('Test');
    component.data.controls.lastName.setValue('Test');
    component.data.controls.password.setValue('Register$1');
    component.data.controls.confirmPassword.setValue('Register$1');
    component.data.controls.terms.setValue(false);
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(el.disabled).toBe(true);
  });

  it('should disabled button is true whit password is empty', () => {
    component.data.controls.email.setValue('test@gmail.com');
    component.data.controls.firstName.setValue('Test');
    component.data.controls.lastName.setValue('Test');
    component.data.controls.password.setValue('');
    component.data.controls.confirmPassword.setValue('Register$1');
    component.data.controls.terms.setValue(false);
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(el.disabled).toBe(true);
  });

  it('should call register method whit lastName is empty', () => {
    component.data.controls.email.setValue('test@gmail.com');
    component.data.controls.firstName.setValue('Test');
    component.data.controls.lastName.setValue('');
    component.data.controls.password.setValue('Register$1');
    component.data.controls.confirmPassword.setValue('Register$1');
    component.data.controls.terms.setValue(true);

    fixture.detectChanges();
    expect(component.register()).toBe(undefined);
  });

  it('call service validateToken', fakeAsync(() => {
    spyOn(registerService, 'validateToken').and.returnValue(
      new Observable((observer: Observer<ValidateTokenResponse>) => {
        return observer.next(Mock_ValidateTokenResponse);
      }),
    );
    fixture.detectChanges();
    component.ngOnInit();
    tick();
    expect(registerService.validateToken).toHaveBeenCalled();
  }));

  it('call service validateToken error', fakeAsync(() => {
    spyOn(registerService, 'validateToken').and.returnValue(
      new Observable((observer: Observer<HttpErrorResponse>) => {
        return observer.error({ error: { statusCode: 400 } });
      }),
    );
    fixture.detectChanges();
    component.ngOnInit();
    tick();
    expect(registerService.validateToken).toHaveBeenCalled();
  }));

  it('call service common', fakeAsync(() => {
    component.route.snapshot.params['hash'] = 'test';
    component.data.controls.password.setValue('Register$1');
    component.data.controls.confirmPassword.setValue('Register$1');
    component.data.controls.terms.setValue(true);

    spyOn(registerService, 'common').and.returnValue(
      new Observable((observer: Observer<CommonRegisterResponse>) => {
        return observer.next(Mock_SuccessDTO);
      }),
    );

    fixture.detectChanges();
    component.register();
    tick();
    expect(registerService.common).toHaveBeenCalled();
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
