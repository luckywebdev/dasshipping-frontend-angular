import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

import { AccountProfileComponent } from '../../accounts/account-profile/account-profile.component';
import { APP_ROUTES } from '../../app.constants';
import { DirectivesModule } from '../../directives.module';
import { LoadingService } from '../../providers/loading/loading.service';
import { UserService } from '../../providers/user/user.service';
import { AuthComponent } from '../auth/auth.component';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent, AuthComponent, AccountProfileComponent],
      imports: [MatMenuModule, HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(
          [{ path: APP_ROUTES.auth, component: AuthComponent },
          { path: `${APP_ROUTES.accounts}/me`, component: AccountProfileComponent }],
        ),
        DirectivesModule],
      providers: [UserService, HttpClientTestingModule, LoadingService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout', async () => {
    await component.logout();
    expect(component.logout).toBeTruthy();
  });

  it('should call myProfile', () => {
    component.myProfile();
    expect(component.myProfile).toBeTruthy();
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
