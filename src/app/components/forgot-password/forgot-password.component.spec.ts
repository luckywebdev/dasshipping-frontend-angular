import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, Observer } from 'rxjs';

import { APP_ROUTES } from '../../app.constants';
import { LoadingService } from '../../providers/loading/loading.service';
import { UserService } from '../../providers/user/user.service';
import { AuthComponent } from '../auth/auth.component';
import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let userService: UserService;
  let loadingService: LoadingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent, AuthComponent],
      imports: [
        RouterTestingModule.withRoutes(
          [{ path: APP_ROUTES.auth, component: AuthComponent }],
        ),
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
      ],
      providers: [
        BrowserAnimationsModule,
        UserService,
        LoadingService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    userService = fixture.debugElement.injector.get(
      UserService,
    );
    loadingService = fixture.debugElement.injector.get(
      LoadingService,
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should email is empty', () => {
    component.email.setValue('');
    expect(component.email.valid).toBeFalsy();
  });

  it('should email not valid', () => {
    component.email.setValue('test');
    expect(component.email.valid).toBeFalsy();
  });

  it('should email valid', () => {
    component.email.setValue('test@gmail.com');
    expect(component.email.valid).toBeTruthy();
  });

  it('should set forgot func to true', () => {
    component.forgot();
    expect(component.forgot).toBeTruthy();
  });

  it('should call the forgot method', () => {
    fixture.detectChanges();
    spyOn(component, 'forgot');
    const el = fixture.debugElement.query(By.css('button')).nativeElement;
    el.click();
    expect(component.forgot).toHaveBeenCalledTimes(0);
  });

  it('should userForgotPasswordPost error', () => {
    component.email.setValue('test@gmail.com');

    spyOn(userService, 'userForgotPasswordPost').and.returnValue(
      new Observable((observer: Observer<any>) => {
        return observer.error('error');
      }),
    );

    component.forgot();
    fixture.detectChanges();
    expect(userService.userForgotPasswordPost).toHaveBeenCalled();
  });

  it('should userForgotPasswordPost success', () => {
    component.email.setValue('test@gmail.com');
    spyOn(loadingService, 'startLoading');
    spyOn(userService, 'userForgotPasswordPost').and.returnValue(
      new Observable((observer: Observer<{ success: boolean }>) => {
        return observer.next({ success: true });
      }),
    );

    let respone;
    userService.userForgotPasswordPost({ email: 'test@gmail.com' })
      .subscribe((res) => {
        respone = res;
        spyOn(loadingService, 'stopLoading');
      });

    component.forgot();
    fixture.detectChanges();
    expect(respone.success).toBeTruthy();
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
