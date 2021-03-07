import { SelectionModel } from '@angular/cdk/collections';
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
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, Observer, of } from 'rxjs';

import { APP_ROUTES } from '../../app.constants';
import { Mock_GetAccountsListResponse } from '../../constants';
import { DeleteAccountsResponse, GetAccountsListResponse } from '../../interfaces/models';
import { NotificationService } from '../../providers/notification/notification.service';
import { UserService } from '../../providers/user/user.service';
import { AccountProfileComponent } from '../account-profile/account-profile.component';
import { AccountListComponent } from './account-list.component';

interface PeriodicElement {
  id: number;
  blocked: string;
  fullName: string;
  role: string;
}

describe('AccountListComponent', () => {
  let component: AccountListComponent;
  let userService: UserService;
  let dialog: MatDialog;
  let fixture: ComponentFixture<AccountListComponent>;
  const dialogRefSpyObj = jasmine.createSpyObj({
    afterClosed: of({}), close: null,
  });
  const dialogRefSpyResNull = jasmine.createSpyObj({
    afterClosed: of(null), close: null,
  });

  const dataSource: any = Mock_GetAccountsListResponse.data.map((item) => {
    return {
      id: item.id,
      blocked: item.blocked,
      fullName: `${item.firstName} ${item.lastName}`,
      role: item.role.name,
    };
  });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountListComponent, AccountProfileComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        BrowserModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,
        RouterTestingModule.withRoutes(
          [{ path: `${APP_ROUTES.accounts}/:id`, component: AccountProfileComponent }],
        ),
        HttpClientTestingModule,
        MatDialogModule],
      providers: [
        UserService,
        HttpClientTestingModule,
        NotificationService,
        { provide: MatDialogRef, useValue: {} }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountListComponent);
    component = fixture.componentInstance;
    dialog = TestBed.get(MatDialog);
    userService = fixture.debugElement.injector.get(
      UserService,
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getList', () => {
    spyOn(userService, 'getList').and.returnValue(
      new Observable((observer: Observer<GetAccountsListResponse>) => {
        return observer.next({
          data: Mock_GetAccountsListResponse.data,
          count: Mock_GetAccountsListResponse.data.length,
        });
      }),
    );

    component['getList']();
    fixture.detectChanges();
    expect(userService.getList).toHaveBeenCalled();
  });

  it('should call getList error', () => {
    spyOn(userService, 'getList').and.returnValue(
      new Observable((observer: Observer<any>) => {
        return observer.error('error');
      }),
    );

    component['getList']();
    fixture.detectChanges();
    expect(userService.getList).toHaveBeenCalled();
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

  it('should call goUser', () => {
    component.goUser(dataSource[0]);
    expect(component.goUser).toBeTruthy();
  });

  it('open modal call fun checkBlockUsers', () => {
    spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    fixture.detectChanges();
    component.checkBlockUsers();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('open modal call fun checkBlockUsers without result', () => {
    spyOn(dialog, 'open').and.returnValue(dialogRefSpyResNull);
    fixture.detectChanges();
    component.checkBlockUsers();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('open modal call fun checkApproveUsers', () => {
    spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    fixture.detectChanges();
    component.checkApproveUsers();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('open modal call fun checkApproveUsers without result', () => {
    spyOn(dialog, 'open').and.returnValue(dialogRefSpyResNull);
    fixture.detectChanges();
    component.checkApproveUsers();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('open modal call fun checkRemoveUsers', () => {
    spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    fixture.detectChanges();
    component.checkRemoveUsers();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('open modal call fun checkRemoveUsers without result', () => {
    spyOn(dialog, 'open').and.returnValue(dialogRefSpyResNull);
    fixture.detectChanges();
    component.checkRemoveUsers();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('should call removeUsers', () => {
    component.dataSource.data = dataSource;
    component.selection = new SelectionModel<PeriodicElement>(true, dataSource);
    spyOn(userService, 'delete').and.returnValue(
      new Observable((observer: Observer<DeleteAccountsResponse>) => {
        return observer.next({ success: true });
      }),
    );

    component.removeUsers();
    fixture.detectChanges();
    expect(userService.delete).toHaveBeenCalled();
    expect(component.dataSource.data.length).toEqual(0);
  });

  it('should call removeUsers one item', () => {
    component.dataSource.data = dataSource;
    component.selection = new SelectionModel<PeriodicElement>(true, [dataSource[0]]);
    spyOn(userService, 'delete').and.returnValue(
      new Observable((observer: Observer<DeleteAccountsResponse>) => {
        return observer.next({ success: true });
      }),
    );

    component.removeUsers();
    fixture.detectChanges();
    expect(userService.delete).toHaveBeenCalled();
    expect(component.dataSource.data.length).toEqual(Mock_GetAccountsListResponse.data.length - 1);
  });

  it('should call removeUsers error', () => {
    component.dataSource.data = dataSource;
    component.selection = new SelectionModel<PeriodicElement>(true, dataSource);
    spyOn(userService, 'delete').and.returnValue(
      new Observable((observer: Observer<any>) => {
        return observer.error('error');
      }),
    );

    component.removeUsers();
    fixture.detectChanges();
    expect(userService.delete).toHaveBeenCalled();
    expect(component.dataSource.data.length).toEqual(Mock_GetAccountsListResponse.data.length);
  });

  it('should call blockUsers', () => {
    component.dataSource.data = dataSource;
    component.selection = new SelectionModel<PeriodicElement>(true, dataSource);
    spyOn(userService, 'setBlock').and.returnValue(
      new Observable((observer: Observer<DeleteAccountsResponse>) => {
        return observer.next({ success: true });
      }),
    );

    component.blockUsers();
    fixture.detectChanges();
    expect(userService.setBlock).toHaveBeenCalled();
  });

  it('should call blockUsers error', () => {
    spyOn(userService, 'setBlock').and.returnValue(
      new Observable((observer: Observer<any>) => {
        return observer.error('error');
      }),
    );

    component.blockUsers();
    fixture.detectChanges();
    expect(userService.setBlock).toHaveBeenCalled();
  });

  it('should call approveUsers', () => {
    component.dataSource.data = dataSource;
    component.selection = new SelectionModel<PeriodicElement>(true, dataSource);
    spyOn(userService, 'setApprove').and.returnValue(
      new Observable((observer: Observer<DeleteAccountsResponse>) => {
        return observer.next({ success: true });
      }),
    );

    component.approveUsers();
    fixture.detectChanges();
    expect(userService.setApprove).toHaveBeenCalled();
  });

  it('should call approveUsers error', () => {
    spyOn(userService, 'setApprove').and.returnValue(
      new Observable((observer: Observer<any>) => {
        return observer.error('error');
      }),
    );

    component.approveUsers();
    fixture.detectChanges();
    expect(userService.setApprove).toHaveBeenCalled();
  });

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
