import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { APP_ROUTES } from '../../app.constants';
import { ErrorService } from '../../providers/error/error.service';
import { FileService } from '../../providers/file/file.service';
import { RegisterService } from '../../providers/register/register.service';
import { RegisterCarrierFinishComponent } from '../register-carrier-finish/register-carrier-finish.component';
import { RegisterCarrierComponent } from '../register-carrier/register-carrier.component';
import { RegisterCarrierInviteComponent } from './register-carrier-invite.component';

describe('RegisterCarrierInviteComponent', () => {
  let component: RegisterCarrierInviteComponent;
  let fixture: ComponentFixture<RegisterCarrierInviteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterCarrierComponent, RegisterCarrierInviteComponent, RegisterCarrierFinishComponent],
      imports: [
        RouterTestingModule.withRoutes(
          [{ path: `${APP_ROUTES.register_carrier_finish}/:hash`, component: RegisterCarrierFinishComponent }],
        ),
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatAutocompleteModule,
      ],
      providers: [RegisterService, FileService, ErrorService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterCarrierInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
