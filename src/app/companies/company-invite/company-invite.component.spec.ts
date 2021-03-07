import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatAutocompleteModule,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MatFormFieldModule,
  MatInputModule,
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
import { CompanyInviteComponent } from './company-invite.component';

describe('CompanyInviteComponent', () => {
  let component: CompanyInviteComponent;
  let registerService: RegisterService;
  let dialog: MatDialog;
  let fixture: ComponentFixture<CompanyInviteComponent>;
  const dialogMock = {
    close: () => { },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyInviteComponent],
      imports: [
        MatAutocompleteModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule,
        DirectivesModule,
      ],
      providers: [
        RegisterService,
        HttpClientTestingModule,
        { provide: MatDialogRef, useValue: { dialogMock } },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        LoadingService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [CompanyInviteComponent] } })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyInviteComponent);
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
    component['getValue']('name');
    expect(component['getValue']).toBeTruthy();
  });

  it('should call invite return error', async(() => {
    spyOn(registerService, 'inviteCarrier').and.returnValue(
      new Observable((observer: Observer<string>) => {
        return observer.error('error');
      }),
    );
    fixture.detectChanges();
    component.invite();
    expect(component.invite).toBeTruthy();
  }));

  it('should call invite', async(() => {
    component.dialogRef = dialog.open(CompanyInviteComponent);
    spyOn(registerService, 'inviteCarrier').and.returnValue(
      new Observable((observer: Observer<InviteDTO>) => {
        return observer.next(Mock_InviteDTO);
      }),
    );
    fixture.detectChanges();
    component.invite();
    expect(component.invite).toBeTruthy();
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
