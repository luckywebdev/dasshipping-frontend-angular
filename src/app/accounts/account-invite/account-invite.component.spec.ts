import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
} from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, Observer } from 'rxjs';

import { Mock_InviteDTO } from '../../constants';
import { DirectivesModule } from '../../directives.module';
import { InviteDTO } from '../../interfaces/models';
import { LoadingService } from '../../providers/loading/loading.service';
import { RegisterService } from '../../providers/register/register.service';
import { UserService } from '../../providers/user/user.service';
import { AccountInviteComponent } from './account-invite.component';

describe('AccountInviteComponent', () => {
  let component: AccountInviteComponent;
  let registerService: RegisterService;
  let dialog: MatDialog;
  let fixture: ComponentFixture<AccountInviteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountInviteComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        DirectivesModule,
      ],
      providers: [
        RegisterService,
        UserService,
        { provide: MatDialogRef, useValue: {} },
        LoadingService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [AccountInviteComponent] } })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountInviteComponent);
    component = fixture.componentInstance;
    registerService = fixture.debugElement.injector.get(
      RegisterService,
    );
    dialog = TestBed.get(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getValue', () => {
    component['getValue']('email');
    expect(component['getValue']).toBeTruthy();
  });

  it('should call invite return error', () => {
    spyOn(registerService, 'inviteAccount').and.returnValue(
      new Observable((observer: Observer<string>) => {
        return observer.error('error');
      }),
    );
    component.invite();
    expect(component.invite).toBeTruthy();
  });

  it('should call invite', () => {
    component.dialogRef = dialog.open(AccountInviteComponent);
    spyOn(registerService, 'inviteAccount').and.returnValue(
      new Observable((observer: Observer<InviteDTO>) => {
        return observer.next(Mock_InviteDTO);
      }),
    );
    fixture.detectChanges();
    component.invite();
    expect(component.invite).toBeTruthy();
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
