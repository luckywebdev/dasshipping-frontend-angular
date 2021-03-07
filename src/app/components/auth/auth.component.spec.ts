import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatCardModule, MatFormFieldModule, MatInputModule, MatTabsModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from '../../providers/auth/auth.service';
import { ErrorService } from '../../providers/error/error.service';
import { FileService } from '../../providers/file/file.service';
import { RegisterService } from '../../providers/register/register.service';
import { UserService } from '../../providers/user/user.service';
import { LoginComponent } from '../login/login.component';
import { RegisterCarrierComponent } from '../register-carrier/register-carrier.component';
import { AuthComponent } from './auth.component';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AuthComponent,
        LoginComponent,
        RegisterCarrierComponent,
      ],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        MatTabsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [
        RegisterService, AuthService, UserService, FileService, ErrorService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply changeTab func selectedTab = 1', () => {
    component.changeTab(1);
    expect(component.selectedTab).toEqual(1);
  });

  it('should apply changeTab func selectedTab = 0', () => {
    component.changeTab(0);
    expect(component.selectedTab).toEqual(0);
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
