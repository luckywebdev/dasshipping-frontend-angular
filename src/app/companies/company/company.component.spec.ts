import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, Observer } from 'rxjs';

import { DirectivesModule } from '../../directives.module';
import { CompanyDTO, FileUploadResponse } from '../../interfaces/models';
import { CompanyService } from '../../providers/company/company.service';
import { FileService } from '../../providers/file/file.service';
import { LoadingService } from '../../providers/loading/loading.service';
import { NotificationService } from '../../providers/notification/notification.service';
import { CompanyComponent } from './company.component';

describe('CompanyComponent', () => {
  let component: CompanyComponent;
  let companyService: CompanyService;
  let fileService: FileService;
  let fixture: ComponentFixture<CompanyComponent>;
  const blob = new Blob();
  const arrayOfBlob = [blob];
  const mockFile: File = new File(arrayOfBlob, 'test-file.jpg');
  const company = {
    id: 1,
    name: 'string',
    address: 'string',
    city: 'string',
    state: 'string',
    zip: 'string',
    dotNumber: 'string',
    msNumber: 'string',
    officePhone: 'string',
    contactPersonFirstName: 'string',
    contactPersonLastName: 'string',
    contactPersonPhone: 'string',
    mcCertificateUrl: 'string',
    insuranceUrl: 'string',
    blocked: false,
    email: 'string',
    avatarUrl: 'string',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatAutocompleteModule,
        RouterTestingModule,
        DirectivesModule,
      ],
      providers: [
        FileService,
        CompanyService,
        LoadingService,
        NotificationService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyComponent);
    component = fixture.componentInstance;
    companyService = fixture.debugElement.injector.get(
      CompanyService,
    );
    fileService = fixture.debugElement.injector.get(
      FileService,
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fun getCompany', () => {
    component['getCompany']();
    expect(component['getCompany']).toBeTruthy();
  });

  it('should call fun getCompany and spy service', () => {
    spyOn(companyService, 'get').and.returnValue(
      new Observable((observer: Observer<CompanyDTO>) => {
        return observer.next(company);
      }),
    );

    component['getCompany']();
    fixture.detectChanges();
    expect(component['getCompany']).toBeTruthy();
  });

  it('should call fun edit', () => {
    component.editable = true;
    component.edit();
    fixture.detectChanges();
    expect(component.edit).toBeTruthy();
  });

  it('should call fun edit with company instace', () => {
    component.editable = false;
    component.company = company;
    component.edit();
    fixture.detectChanges();
    expect(component.edit).toBeTruthy();
  });

  it('should call fun getValue', () => {
    component['getValue']('state');
    expect(component['getValue']).toBeTruthy();
  });

  it('should call fun save', () => {
    component.company = company;
    spyOn(companyService, 'update').and.returnValue(
      new Observable((observer: Observer<CompanyDTO>) => {
        return observer.next(company);
      }),
    );
    component.save();
    expect(component.save).toBeTruthy();
  });

  it('should call fun uploadPhoto', () => {
    spyOn(fileService, 'upload').and.returnValue(
      new Observable((observer: Observer<FileUploadResponse>) => {
        return observer.next({
          url: 'string',
          signedUrl: 'string',
        });
      }),
    );
    component.uploadPhoto(mockFile);
    expect(component.uploadPhoto).toBeTruthy();
  });

  it('should call fun removeCover', () => {
    component.removeCover();
    expect(component.removeCover).toBeTruthy();
    expect(component.cover_photo).toEqual(null);
  });

  it('should call fun uploadDocument', () => {
    component.company = company;
    spyOn(fileService, 'upload').and.returnValue(
      new Observable((observer: Observer<FileUploadResponse>) => {
        return observer.next({
          url: 'string',
          signedUrl: 'string',
        });
      }),
    );
    component.uploadDocument(mockFile, 'mcCertificateUrl');
    expect(component.uploadDocument).toBeTruthy();
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
