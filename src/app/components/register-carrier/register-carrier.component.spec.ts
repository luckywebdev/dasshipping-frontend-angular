import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, Observer } from 'rxjs';

import { APP_ROUTES } from '../../app.constants';
import { Mock_ValidateTokenResponse } from '../../constants';
import { DirectivesModule } from '../../directives.module';
import { CarrierRegisterResponse, FileUploadResponse } from '../../interfaces/models';
import { ValidateTokenResponse } from '../../interfaces/validateTokenResponse';
import { ErrorService } from '../../providers/error/error.service';
import { FileService } from '../../providers/file/file.service';
import { RegisterService } from '../../providers/register/register.service';
import { AuthComponent } from '../auth/auth.component';
import { ErrorComponent } from '../error/error.component';
import { RegisterCarrierFinishComponent } from '../register-carrier-finish/register-carrier-finish.component';
import { RegisterCarrierComponent } from './register-carrier.component';

describe('RegisterCarrierComponent', () => {
  let component: RegisterCarrierComponent;
  let fixture: ComponentFixture<RegisterCarrierComponent>;
  let registerService: RegisterService;
  let fileService: FileService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterCarrierComponent, RegisterCarrierFinishComponent, ErrorComponent, AuthComponent],
      imports: [
        RouterTestingModule.withRoutes(
          [{ path: `${APP_ROUTES.register_carrier_finish}/:hash`, component: RegisterCarrierFinishComponent },
          { path: APP_ROUTES.error, component: ErrorComponent },
          { path: APP_ROUTES.auth, component: AuthComponent }],
        ),
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatAutocompleteModule,
        DirectivesModule,
      ],
      providers: [RegisterService, FileService, ErrorService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterCarrierComponent);
    component = fixture.componentInstance;
    registerService = fixture.debugElement.injector.get(
      RegisterService,
    );
    fileService = fixture.debugElement.injector.get(
      FileService,
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should data is empty', () => {
    component.data.controls.email.setValue('');
    component.data.controls.name.setValue('');
    component.data.controls.address.setValue('');
    component.data.controls.city.setValue('');
    component.data.controls.state.setValue('');
    component.data.controls.zip.setValue('');
    component.data.controls.dotNumber.setValue('');
    component.data.controls.msNumber.setValue('');
    component.data.controls.officePhone.setValue('');
    component.data.controls.contactPersonFirstName.setValue('');
    component.data.controls.contactPersonLastName.setValue('');
    component.data.controls.contactPersonPhone.setValue('');
    component.data.controls.terms.setValue(false);
    expect(component.data.valid).toBeFalsy();
  });

  it('should data valid', () => {
    component.data.controls.email.setValue('test@gmail.com');
    component.data.controls.name.setValue('Test');
    component.data.controls.address.setValue('test');
    component.data.controls.city.setValue('test');
    component.data.controls.state.setValue('test');
    component.data.controls.zip.setValue('test');
    component.data.controls.dotNumber.setValue('test');
    component.data.controls.msNumber.setValue('test');
    component.data.controls.officePhone.setValue('test');
    component.data.controls.contactPersonFirstName.setValue('test');
    component.data.controls.contactPersonLastName.setValue('test');
    component.data.controls.contactPersonPhone.setValue('test');
    component.data.controls.terms.setValue(true);
    expect(component.data.valid).toBeTruthy();
  });

  it('should data email not valid', () => {
    component.data.controls.email.setValue('test');
    component.data.controls.name.setValue('Test');
    component.data.controls.address.setValue('test');
    component.data.controls.city.setValue('test');
    component.data.controls.state.setValue('test');
    component.data.controls.zip.setValue('test');
    component.data.controls.dotNumber.setValue('test');
    component.data.controls.msNumber.setValue('test');
    component.data.controls.officePhone.setValue('test');
    component.data.controls.contactPersonFirstName.setValue('test');
    component.data.controls.contactPersonLastName.setValue('test');
    component.data.controls.contactPersonPhone.setValue('test');
    component.data.controls.terms.setValue(true);
    expect(component.data.valid).toBeFalsy();
  });

  it('should set register func to true', () => {
    component.register();
    expect(component.register).toBeTruthy();
  });

  it('should call the register method', () => {
    fixture.detectChanges();
    spyOn(component, 'register');
    const el = fixture.debugElement.query(By.css('button')).nativeElement;
    el.click();
    expect(component.register).toHaveBeenCalledTimes(0);
  });

  it('should disabled button is false', () => {
    component.data.controls.email.setValue('test@gmail.com');
    component.data.controls.name.setValue('Test');
    component.data.controls.address.setValue('test');
    component.data.controls.city.setValue('test');
    component.data.controls.state.setValue('test');
    component.data.controls.zip.setValue('test');
    component.data.controls.dotNumber.setValue('test');
    component.data.controls.msNumber.setValue('test');
    component.data.controls.officePhone.setValue('test');
    component.data.controls.contactPersonFirstName.setValue('test');
    component.data.controls.contactPersonLastName.setValue('test');
    component.data.controls.contactPersonPhone.setValue('test');
    component.data.controls.terms.setValue(true);
    component.mcCertificate = {};
    component.insurance = {};
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(el.disabled).toBe(false);
  });

  it('should disabled button is true', () => {
    component.data.controls.email.setValue('');
    component.data.controls.name.setValue('');
    component.data.controls.address.setValue('');
    component.data.controls.city.setValue('');
    component.data.controls.state.setValue('');
    component.data.controls.zip.setValue('');
    component.data.controls.dotNumber.setValue('');
    component.data.controls.msNumber.setValue('');
    component.data.controls.officePhone.setValue('');
    component.data.controls.contactPersonFirstName.setValue('');
    component.data.controls.contactPersonLastName.setValue('');
    component.data.controls.contactPersonPhone.setValue('');
    component.data.controls.terms.setValue(false);
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(el.disabled).toBe(true);
  });

  it('should disabled button is true whit not valid email', () => {
    component.data.controls.email.setValue('test');
    component.data.controls.name.setValue('Test');
    component.data.controls.address.setValue('test');
    component.data.controls.city.setValue('test');
    component.data.controls.state.setValue('test');
    component.data.controls.zip.setValue('test');
    component.data.controls.dotNumber.setValue('test');
    component.data.controls.msNumber.setValue('test');
    component.data.controls.officePhone.setValue('test');
    component.data.controls.contactPersonFirstName.setValue('test');
    component.data.controls.contactPersonLastName.setValue('test');
    component.data.controls.contactPersonPhone.setValue('test');
    component.data.controls.terms.setValue(true);
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(el.disabled).toBe(true);
  });

  it('should set validateFields func to true', () => {
    component.validateFields();
    expect(component.validateFields).toBeTruthy();
  });

  it('should set validateFields func to disabled filed', () => {
    component.data.controls.email.setValue('');
    component.data.controls.name.setValue('Test');
    component.data.controls.name.disable();
    component.data.controls.address.setValue('');
    component.data.controls.city.setValue('');
    component.data.controls.state.setValue('');
    component.data.controls.zip.setValue('');
    component.data.controls.dotNumber.setValue('');
    component.data.controls.msNumber.setValue('');
    component.data.controls.officePhone.setValue('');
    component.data.controls.contactPersonFirstName.setValue('');
    component.data.controls.contactPersonLastName.setValue('');
    component.data.controls.contactPersonPhone.setValue('');
    component.data.controls.terms.setValue(false);
    component.validateFields();
    expect(component.validateFields).toBeTruthy();
  });

  it('should set selectMcCertificate func to true', () => {
    component.selectMcCertificate({});
    expect(component.selectMcCertificate).toBeTruthy();
  });

  it('should call the selectMcCertificate method', () => {
    fixture.detectChanges();
    spyOn(component, 'selectMcCertificate');
    const el = fixture.debugElement.query(By.css('input'));
    el.triggerEventHandler('change', {});
    expect(component.selectMcCertificate).toHaveBeenCalledTimes(0);
  });

  it('should set selectInsurance func to true', () => {
    component.selectInsurance({});
    expect(component.selectInsurance).toBeTruthy();
  });

  it('should call the selectInsurance method', () => {
    fixture.detectChanges();
    spyOn(component, 'selectInsurance');
    const el = fixture.debugElement.query(By.css('input'));
    el.triggerEventHandler('change', {});
    expect(component.selectInsurance).toHaveBeenCalledTimes(0);
  });

  it('should call register method whit address is empty', () => {
    component.data.controls.email.setValue('test@gmail.com');
    component.data.controls.name.setValue('Test');
    component.data.controls.address.setValue('');
    component.data.controls.city.setValue('test');
    component.data.controls.state.setValue('test');
    component.data.controls.zip.setValue('test');
    component.data.controls.dotNumber.setValue('test');
    component.data.controls.msNumber.setValue('test');
    component.data.controls.officePhone.setValue('test');
    component.data.controls.contactPersonFirstName.setValue('test');
    component.data.controls.contactPersonLastName.setValue('test');
    component.data.controls.contactPersonPhone.setValue('test');
    component.data.controls.terms.setValue(true);
    fixture.detectChanges();
    let response;
    component.register()
      .then((res) => {
        response = res;
      });
    expect(response).toBe(undefined);
  });

  it('should call register method whit mcCertificate is null', () => {
    component.data.controls.email.setValue('test@gmail.com');
    component.data.controls.name.setValue('Test');
    component.data.controls.address.setValue('test');
    component.data.controls.city.setValue('test');
    component.data.controls.state.setValue('test');
    component.data.controls.zip.setValue('test');
    component.data.controls.dotNumber.setValue('test');
    component.data.controls.msNumber.setValue('test');
    component.data.controls.officePhone.setValue('test');
    component.data.controls.contactPersonFirstName.setValue('test');
    component.data.controls.contactPersonLastName.setValue('test');
    component.data.controls.contactPersonPhone.setValue('test');
    component.data.controls.terms.setValue(true);
    component.mcCertificate = null;
    component.insurance = {};
    fixture.detectChanges();
    let response;
    component.register()
      .then((res) => {
        response = res;
      });
    expect(response).toBe(undefined);
  });

  it('should call register method whit insurance is null', () => {
    component.data.controls.email.setValue('test@gmail.com');
    component.data.controls.name.setValue('Test');
    component.data.controls.address.setValue('test');
    component.data.controls.city.setValue('test');
    component.data.controls.state.setValue('test');
    component.data.controls.zip.setValue('test');
    component.data.controls.dotNumber.setValue('test');
    component.data.controls.msNumber.setValue('test');
    component.data.controls.officePhone.setValue('test');
    component.data.controls.contactPersonFirstName.setValue('test');
    component.data.controls.contactPersonLastName.setValue('test');
    component.data.controls.contactPersonPhone.setValue('test');
    component.data.controls.terms.setValue(true);
    component.mcCertificate = {};
    component.insurance = null;
    fixture.detectChanges();
    let response;
    component.register()
      .then((res) => {
        response = res;
      });
    expect(response).toBe(undefined);
  });

  it('should hash is empty', () => {
    component.route.snapshot.params['hash'] = '';
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
  });

  it('call registerService validateToken', fakeAsync(() => {
    component.data.controls.email.setValue('');
    component.data.controls.name.setValue('');
    component.data.controls.address.setValue('');
    component.data.controls.city.setValue('');
    component.data.controls.state.setValue('');
    component.data.controls.zip.setValue('');
    component.data.controls.dotNumber.setValue('');
    component.data.controls.msNumber.setValue('');
    component.data.controls.officePhone.setValue('');
    component.data.controls.contactPersonFirstName.setValue('');
    component.data.controls.contactPersonLastName.setValue('');
    component.data.controls.contactPersonPhone.setValue('');
    component.data.controls.terms.setValue(false);
    component.route.snapshot.params['hash'] = 'test';
    fixture.detectChanges();
    spyOn(registerService, 'validateToken').and.returnValue(
      new Observable((observer: Observer<ValidateTokenResponse>) => {
        return observer.next(Mock_ValidateTokenResponse);
      }));
    fixture.detectChanges();
    component.ngOnInit();
    tick();
    expect(registerService.validateToken).toHaveBeenCalled();
  }));

  it('call registerService validateToken error', fakeAsync(() => {
    component.data.controls.email.setValue('');
    component.data.controls.name.setValue('');
    component.data.controls.address.setValue('');
    component.data.controls.city.setValue('');
    component.data.controls.state.setValue('');
    component.data.controls.zip.setValue('');
    component.data.controls.dotNumber.setValue('');
    component.data.controls.msNumber.setValue('');
    component.data.controls.officePhone.setValue('');
    component.data.controls.contactPersonFirstName.setValue('');
    component.data.controls.contactPersonLastName.setValue('');
    component.data.controls.contactPersonPhone.setValue('');
    component.data.controls.terms.setValue(false);
    component.route.snapshot.params['hash'] = 'test';
    fixture.detectChanges();
    spyOn(registerService, 'validateToken').and.returnValue(
      new Observable((observer: Observer<ValidateTokenResponse>) => {
        return observer.error({ message: 'BadRequest', error: 'BadRequest', statusCode: 400 });
      }));
    fixture.detectChanges();
    component.ngOnInit();
    tick();
    expect(registerService.validateToken).toHaveBeenCalled();
  }));

  it('call registerService carrier', fakeAsync(() => {
    component.data.controls.email.setValue('test@gmail.com');
    component.data.controls.name.setValue('Test');
    component.data.controls.address.setValue('test');
    component.data.controls.city.setValue('test');
    component.data.controls.state.setValue('test');
    component.data.controls.zip.setValue('test');
    component.data.controls.dotNumber.setValue('test');
    component.data.controls.msNumber.setValue('test');
    component.data.controls.officePhone.setValue('test');
    component.data.controls.contactPersonFirstName.setValue('test');
    component.data.controls.contactPersonLastName.setValue('test');
    component.data.controls.contactPersonPhone.setValue('test');
    component.data.controls.terms.setValue(true);
    component['hash'] = 'test';
    const blob = new Blob();
    const arrayOfBlob = [blob];
    component.mcCertificate = new File(arrayOfBlob, 'mcCertificate.jpg');
    component.insurance = new File(arrayOfBlob, 'insurance.jpg');

    spyOn<any>(component, 'uploadFile').and.returnValue('url_string');

    spyOn(registerService, 'carrier').and.returnValue(
      new Observable((observer: Observer<CarrierRegisterResponse>) => {
        return observer.next({ success: true, hash: 'test' });
      }),
    );
    fixture.detectChanges();
    component.register();
    tick();
    expect(registerService.carrier).toHaveBeenCalled();
  }));

  it('call registerService carrierNew', fakeAsync(() => {
    component.data.controls.email.setValue('test@gmail.com');
    component.data.controls.name.setValue('Test');
    component.data.controls.address.setValue('test');
    component.data.controls.city.setValue('test');
    component.data.controls.state.setValue('test');
    component.data.controls.zip.setValue('test');
    component.data.controls.dotNumber.setValue('test');
    component.data.controls.msNumber.setValue('test');
    component.data.controls.officePhone.setValue('test');
    component.data.controls.contactPersonFirstName.setValue('test');
    component.data.controls.contactPersonLastName.setValue('test');
    component.data.controls.contactPersonPhone.setValue('test');
    component.data.controls.terms.setValue(true);
    const blob = new Blob();
    const arrayOfBlob = [blob];
    component.mcCertificate = new File(arrayOfBlob, 'mcCertificate.jpg');
    component.insurance = new File(arrayOfBlob, 'insurance.jpg');

    spyOn<any>(component, 'uploadFile').and.returnValue({
      url: 'string',
      signedUrl: 'string',
    });

    spyOn(registerService, 'carrierNew').and.returnValue(
      new Observable((observer: Observer<CarrierRegisterResponse>) => {
        return observer.next({ success: true, hash: 'test' });
      }),
    );
    fixture.detectChanges();
    component.register();
    tick();
    expect(registerService.carrierNew).toHaveBeenCalled();
  }));

  it('call private func uploadFile', async () => {
    const blob = new Blob();
    const arrayOfBlob = [blob];
    const file = new File(arrayOfBlob, 'mcCertificate.jpg');

    spyOn(fileService, 'upload').and.returnValue(
      new Observable((observer: Observer<FileUploadResponse>) => {
        return observer.next({
          url: 'string',
          signedUrl: 'string',
        });
      }),
    );
    fixture.detectChanges();
    const resp = await component['uploadFile'](file);
    expect(resp).toEqual('string');
  });

  it('call private func uploadFile error', async () => {
    const blob = new Blob();
    const arrayOfBlob = [blob];
    const file = new File(arrayOfBlob, 'test.jpg');

    spyOn(fileService, 'upload').and.returnValue(
      new Observable((observer: Observer<any>) => {
        return observer.error('BadRequest');
      }),
    );

    fixture.detectChanges();
    component['uploadFile'](file)
      .catch((err) => {
        expect(err).toEqual('BadRequest');
      });
  });

  it('call func login', fakeAsync(() => {
    component.login();
    tick();
    expect(component['router'].url).toEqual('/auth');
  }));

  it('call func login redirect auth', fakeAsync(() => {
    component['router'].navigate(['/auth']);
    tick();
    component.login();
    expect(true).toEqual(true);
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
