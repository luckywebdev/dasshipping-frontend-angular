import { SelectionModel } from '@angular/cdk/collections';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
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

import { APP_ROUTES } from '../../app.constants';
import { Mock_GetCompanyListResponse } from '../../constants';
import { BlockCompanyResponse, GetCompanyListResponse } from '../../interfaces/models';
import { CompanyService } from '../../providers/company/company.service';
import { NotificationService } from '../../providers/notification/notification.service';
import { CompanyComponent } from '../company/company.component';
import { CompanyListComponent } from './company-list.component';

interface PeriodicElement {
  id: number;
  name: string;
  full_name: string;
  address: string;
  officePhone: string;
  email: string;
}

describe('CompanyListComponent', () => {
  let component: CompanyListComponent;
  let companyService: CompanyService;
  let dialog: MatDialog;
  let fixture: ComponentFixture<CompanyListComponent>;
  const dialogRefSpyObj = jasmine.createSpyObj({
    afterClosed: of({}), close: null,
  });
  const dialogRefSpyResNull = jasmine.createSpyObj({
    afterClosed: of(null), close: null,
  });

  const dataSource: any = Mock_GetCompanyListResponse.data.map((item) => {
    return {
      id: item.id,
      name: item.name,
      full_name: `${item.contactPersonFirstName} ${item.contactPersonLastName}`,
      address: item.address,
      officePhone: item.officePhone,
      email: item.email,
    };
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyListComponent, CompanyComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
        RouterTestingModule.withRoutes(
          [{ path: `${APP_ROUTES.company}/:id`, component: CompanyComponent }],
        ),
        HttpClientTestingModule,
        MatDialogModule,
        MatAutocompleteModule,
      ],
      providers: [
        NotificationService,
        HttpClientTestingModule,
        CompanyService,
        { provide: MatDialogRef, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyListComponent);
    component = fixture.componentInstance;
    dialog = TestBed.get(MatDialog);
    companyService = fixture.debugElement.injector.get(
      CompanyService,
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getList', () => {
    spyOn(companyService, 'getList').and.returnValue(
      new Observable((observer: Observer<GetCompanyListResponse>) => {
        return observer.next({
          data: Mock_GetCompanyListResponse.data,
          count: Mock_GetCompanyListResponse.data.length,
        });
      }),
    );

    component['getList']();
    fixture.detectChanges();
    expect(companyService.getList).toHaveBeenCalled();
  });

  it('should call getList error', () => {
    spyOn(companyService, 'getList').and.returnValue(
      new Observable((observer: Observer<any>) => {
        return observer.error('error');
      }),
    );

    component['getList']();
    fixture.detectChanges();
    expect(companyService.getList).toHaveBeenCalled();
  });

  it('should call sortData', () => {
    component.goCompany({
      id: 1,
      name: 'string',
      full_name: 'string',
      address: 'string',
      officePhone: 'string',
      email: 'string',
    });
    expect(component.goCompany).toBeTruthy();
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

  it('open modal call fun ckecBlockCompanies', () => {
    spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    fixture.detectChanges();
    component.ckecBlockCompanies();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('open modal call fun ckecBlockCompanies without result', () => {
    spyOn(dialog, 'open').and.returnValue(dialogRefSpyResNull);
    fixture.detectChanges();
    component.ckecBlockCompanies();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('should call blockCompanies', () => {
    component.selection = new SelectionModel<PeriodicElement>(true, dataSource);
    spyOn(companyService, 'setBlock').and.returnValue(
      new Observable((observer: Observer<BlockCompanyResponse>) => {
        return observer.next({ success: true });
      }),
    );
    component['blockCompanies']('Test');
    expect(component['blockCompanies']).toBeTruthy();
  });

  it('should call blockCompanies error', () => {
    spyOn(companyService, 'setBlock').and.returnValue(
      new Observable((observer: Observer<any>) => {
        return observer.error('error');
      }),
    );
    component['blockCompanies']('Test');
    expect(component['blockCompanies']).toBeTruthy();
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
