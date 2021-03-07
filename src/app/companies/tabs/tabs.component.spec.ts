import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DirectivesModule } from '../../directives.module';
import { RegisterService } from '../../providers/register/register.service';
import { CompanyInviteComponent } from '../company-invite/company-invite.component';
import { TabsComponent } from './tabs.component';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;
  let dialog: MatDialog;
  const dialogRefSpyObj = jasmine.createSpyObj({
    afterClosed: of({}), close: null,
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabsComponent, CompanyInviteComponent],
      imports: [
        MatDialogModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        DirectivesModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        RegisterService,
        HttpClientTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [CompanyInviteComponent] } })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    dialog = TestBed.get(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call addCompany', () => {
    component.addCompany();
    expect(component.addCompany).toBeTruthy();
  });

  it('open modal', () => {
    spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    fixture.detectChanges();
    component.addCompany();
    expect(component.dialog.open).toHaveBeenCalled();
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
