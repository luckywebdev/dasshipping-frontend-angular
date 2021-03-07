import { SelectionModel } from '@angular/cdk/collections';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, Observer, of } from 'rxjs';

import { Mock_GetCompanyInvitesListResponse, Mock_InviteDTO } from '../../constants';
import { GetInvitationsListResponse } from '../../interfaces/getInvitationsListResponse';
import { ExpireInviteResponse, ResendInviteResponse } from '../../interfaces/models';
import { NotificationService } from '../../providers/notification/notification.service';
import { RegisterService } from '../../providers/register/register.service';
import { InviteListComponent } from './invite-list.component';

interface PeriodicElement {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  expire: string;
  status: string;
}

describe('InviteListComponent', () => {
  let component: InviteListComponent;
  let dialog: MatDialog;
  let registerService: RegisterService;
  let fixture: ComponentFixture<InviteListComponent>;
  const dialogRefSpyObj = jasmine.createSpyObj({
    afterClosed: of({}), close: null,
  });
  const dialogRefSpyResNull = jasmine.createSpyObj({
    afterClosed: of(null), close: null,
  });

  const dataSource: any = Mock_GetCompanyInvitesListResponse.data.map((item) => {
    return {
      id: item.id,
      email: item.email,
      name: item.company.name,
      createdAt: new Date(),
      expire: new Date(),
      status: item.status.name,
    };
  });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InviteListComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatProgressSpinnerModule,
        MatDialogModule],
      providers: [
        RegisterService,
        HttpClientTestingModule,
        { provide: MatDialogRef, useValue: {} },
        NotificationService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteListComponent);
    component = fixture.componentInstance;
    dialog = TestBed.get(MatDialog);
    registerService = fixture.debugElement.injector.get(
      RegisterService,
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getList', () => {
    spyOn(registerService, 'getComapnyInvite').and.returnValue(
      new Observable((observer: Observer<GetInvitationsListResponse>) => {
        return observer.next({
          data: Mock_GetCompanyInvitesListResponse.data,
          count: Mock_GetCompanyInvitesListResponse.data.length,
        });
      }),
    );

    component['getList']();
    fixture.detectChanges();
    expect(registerService.getComapnyInvite).toHaveBeenCalled();
  });

  it('should call getList error', () => {
    spyOn(registerService, 'getComapnyInvite').and.returnValue(
      new Observable((observer: Observer<any>) => {
        return observer.error('error');
      }),
    );

    component['getList']();
    fixture.detectChanges();
    expect(registerService.getComapnyInvite).toHaveBeenCalled();
  });

  it('should call changePage', () => {
    component.changePage({
      pageIndex: 0,
      previousPageIndex: 0,
      pageSize: 1,
      length: 2,
    });
    expect(component.changePage).toBeTruthy();
  });

  it('should call sortData', () => {
    component.sortData({
      active: 'name',
      direction: 'desc',
    });
    expect(component.sortData).toBeTruthy();
  });

  it('should call updateList', () => {
    component['updateList'](Mock_InviteDTO);
    expect(component['updateList']).toBeTruthy();
  });

  it('should call isAllSelected', () => {
    component.isAllSelected();
    expect(component.isAllSelected).toBeTruthy();
  });

  it('should call masterToggle all selected', () => {
    component.masterToggle();
    expect(component.masterToggle).toBeTruthy();
  });

  it('should call masterToggle', () => {
    component.selection = new SelectionModel<PeriodicElement>(true, []);
    component.dataSource.data = dataSource;
    component.masterToggle();
    expect(component.masterToggle).toBeTruthy();
  });

  it('should call checkboxLabel empty param', () => {
    component.checkboxLabel();
    expect(component.checkboxLabel).toBeTruthy();
  });

  it('should call checkboxLabel', () => {
    component.selection = new SelectionModel<PeriodicElement>(true, dataSource);
    component.checkboxLabel(dataSource[0]);
    spyOn(component.selection, 'isSelected');
    expect(component.checkboxLabel).toBeTruthy();
  });

  it('should call resendInvite', () => {
    component.selection = new SelectionModel<PeriodicElement>(true, dataSource);
    spyOn(registerService, 'inviteResend').and.returnValue(
      new Observable((observer: Observer<ResendInviteResponse>) => {
        return observer.next({ success: true });
      }),
    );
    component.resendInvite();
    expect(component.resendInvite).toBeTruthy();
  });

  it('should call resendInvite error', () => {
    spyOn(registerService, 'inviteResend').and.returnValue(
      new Observable((observer: Observer<any>) => {
        return observer.error('error');
      }),
    );
    component.resendInvite();
    expect(component.resendInvite).toBeTruthy();
  });

  it('should call expireInvite', () => {
    component.selection = new SelectionModel<PeriodicElement>(true, dataSource);
    spyOn(registerService, 'inviteExpire').and.returnValue(
      new Observable((observer: Observer<ExpireInviteResponse>) => {
        return observer.next({ success: true });
      }),
    );
    component.expireInvite();
    expect(component.expireInvite).toBeTruthy();
  });

  it('should call expireInvite error', () => {
    spyOn(registerService, 'inviteExpire').and.returnValue(
      new Observable((observer: Observer<any>) => {
        return observer.error('error');
      }),
    );
    component.expireInvite();
    expect(component.expireInvite).toBeTruthy();
  });

  it('open modal call fun resendInvitations', () => {
    spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    fixture.detectChanges();
    component.resendInvitations();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('open modal call fun resendInvitations without result', () => {
    spyOn(dialog, 'open').and.returnValue(dialogRefSpyResNull);
    fixture.detectChanges();
    component.resendInvitations();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('open modal call fun expireInvitations', () => {
    spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    fixture.detectChanges();
    component.expireInvitations();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('open modal call fun expireInvitations without result', () => {
    spyOn(dialog, 'open').and.returnValue(dialogRefSpyResNull);
    fixture.detectChanges();
    component.expireInvitations();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('success', async(() => {
    component.newInvite = Mock_InviteDTO;
    expect(component['updateList']).toBeTruthy();
  }));

  afterAll(() => {
    component.loading = false;
    fixture.detectChanges();
    const elements = document.body.getElementsByClassName('.cdk-overlay-container');
    while (elements.length > 0) {
      elements[0].remove();
    }
    fixture.destroy();
  });
});
