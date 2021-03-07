import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, Observer } from 'rxjs';

import { Mock_AccountDTO } from '../../constants';
import { AccountDTO, FileUploadResponse } from '../../interfaces/models';
import { FileService } from '../../providers/file/file.service';
import { NotificationService } from '../../providers/notification/notification.service';
import { UserService } from '../../providers/user/user.service';
import { AccountProfileComponent } from './account-profile.component';

describe('AccountProfileComponent', () => {
  let component: AccountProfileComponent;
  let fileService: FileService;
  let userService: UserService;
  let fixture: ComponentFixture<AccountProfileComponent>;
  const blob = new Blob();
  const arrayOfBlob = [blob];
  const mockFile: File = new File(arrayOfBlob, 'test-file.jpg');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountProfileComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatAutocompleteModule,
        RouterTestingModule,
      ],
      providers: [UserService, FileService, NotificationService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfileComponent);
    component = fixture.componentInstance;
    fileService = fixture.debugElement.injector.get(
      FileService,
    );
    userService = fixture.debugElement.injector.get(
      UserService,
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fun removeAvatar', () => {
    component.removeAvatar();
    expect(component.removeAvatar).toBeTruthy();
    expect(component.avatar).toEqual(null);
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
    component.uploadAvatar(mockFile);
    expect(component.uploadAvatar).toBeTruthy();
  });

  it('should call fun save', () => {
    component.save();
    expect(component.save).toBeTruthy();
  });

  it('should call fun save my profile', () => {
    component.id = 'me';
    spyOn(userService, 'updateMyProfile').and.returnValue(
      new Observable((observer: Observer<AccountDTO>) => {
        return observer.next(Mock_AccountDTO);
      }),
    );
    component.save();
    expect(component.save).toBeTruthy();
  });

  it('should call fun save other profile', () => {
    component.id = '1';
    spyOn(userService, 'updateMyProfile').and.returnValue(
      new Observable((observer: Observer<AccountDTO>) => {
        return observer.next(Mock_AccountDTO);
      }),
    );
    component.save();
    expect(component.save).toBeTruthy();
  });

  it('should call fun getUser', () => {
    component.id = '1';
    spyOn(userService, 'getById').and.returnValue(
      new Observable((observer: Observer<AccountDTO>) => {
        return observer.next(Mock_AccountDTO);
      }),
    );
    component['getUser']();
    expect(component['getUser']).toBeTruthy();
  });

  it('should call ngOnInit with super admin', async(() => {
    userService.user = null;
    userService.user = Mock_AccountDTO;
    fixture.detectChanges();
    component['ngOnInit']();
    expect(component['ngOnInit']).toBeTruthy();
    expect(component.roles.length).toEqual(5);
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
