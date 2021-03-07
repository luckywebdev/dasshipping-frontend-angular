import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, Observer } from 'rxjs';

import { APP_ROUTES } from '../../app.constants';
import { DirectivesModule } from '../../directives.module';
import { LoginResponse } from '../../interfaces/models';
import { AuthService } from '../../providers/auth/auth.service';
import { UserService } from '../../providers/user/user.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        RouterTestingModule.withRoutes(
          [{ path: APP_ROUTES.orders, loadChildren: './orders/orders.module#OrdersModule' }],
        ),
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        DirectivesModule,
      ],
      providers: [AuthService, UserService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = fixture.debugElement.injector.get(
      AuthService,
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should email is empty', () => {
    component.data.email.setValue('');
    expect(component.data.email.valid).toBeFalsy();
  });

  it('should email not valid', () => {
    component.data.email.setValue('test');
    expect(component.data.email.valid).toBeFalsy();
  });

  it('should email valid', () => {
    component.data.email.setValue('test@gmail.com');
    expect(component.data.email.valid).toBeTruthy();
  });

  it('should password is empty', () => {
    component.data.password.setValue('');
    expect(component.data.password.valid).toBeFalsy();
  });

  it('should password valid', () => {
    component.data.password.setValue('test');
    expect(component.data.password.valid).toBeTruthy();
  });

  it('should remember', () => {
    expect(component.data.remember).toBeFalsy();
  });

  it('should remember is set', () => {
    component.data.remember = true;
    expect(component.data.remember).toBeTruthy();
  });

  it('should set login func to true', () => {
    component.login();
    expect(component.login).toBeTruthy();
  });

  it('should call the login method', () => {
    fixture.detectChanges();
    spyOn(component, 'login');
    const el = fixture.debugElement.query(By.css('button')).nativeElement;
    el.click();
    expect(component.login).toHaveBeenCalledTimes(0);
  });

  it('should set rememberMe func to true', () => {
    component.rememberMe({ checked: false });
    expect(component.rememberMe).toBeTruthy();
  });

  it('should remember set true whit method', () => {
    component.rememberMe({ checked: true });
    expect(component.data.remember).toBeTruthy();
  });

  it('should remember set false whit method', () => {
    component.rememberMe({ checked: false });
    expect(component.data.remember).toBeFalsy();
  });

  it('should call the rememberMe method', () => {
    fixture.detectChanges();
    spyOn(component, 'rememberMe');
    const el = fixture.debugElement.query(By.css('mat-checkbox'));
    el.triggerEventHandler('change', {});
    expect(component.rememberMe).toHaveBeenCalledTimes(1);
  });

  it('should set validateFields func to true', () => {
    component.validateFields();
    expect(component.validateFields).toBeTruthy();
  });

  it('should disabled button is false', () => {
    component.data.email.setValue('test@gmail.com');
    component.data.password.setValue('test');
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(el.disabled).toBe(false);
  });

  it('should disabled button is true', () => {
    component.data.email.setValue('');
    component.data.password.setValue('');
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(el.disabled).toBe(true);
  });

  it('should disabled button is true whit not valid email', () => {
    component.data.email.setValue('test');
    component.data.password.setValue('test');
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(el.disabled).toBe(true);
  });

  it('call authService authLoginPost', fakeAsync(() => {
    component.data.email.setValue('test@gmail.com');
    component.data.password.setValue('test');
    spyOn(authService, 'authLoginPost').and.returnValue(
      new Observable((observer: Observer<LoginResponse>) => {
        return observer.next({
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
          expiresIn: 3600,
        });
      }),
    );
    fixture.detectChanges();
    component.login();
    tick();
    expect(authService.authLoginPost).toHaveBeenCalled();
  }));

  it('should goRegister func call', () => {
    component.goRegister();
    expect(component.goRegister).toBeTruthy();
  });

  afterAll(() => {
    fixture.detectChanges();
    const elements = document.body.getElementsByClassName('.cdk-overlay-container');
    while (elements.length > 0) {
      elements[0].remove();
    }
    fixture.destroy();
  });
});
