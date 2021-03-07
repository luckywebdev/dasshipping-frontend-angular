import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

import { APP_ROUTES } from '../../app.constants';
import { REGEX_PHONE } from '../../constants';
import { STATES } from '../../constants/states.constant';
import { FileUploadResponse } from '../../interfaces/models';
import { PhoneNumberPipe } from '../../pipes/number-phone';
import { ErrorService } from '../../providers/error/error.service';
import { FileService } from '../../providers/file/file.service';
import { HereService } from '../../providers/here/here.service';
import { LoadingService } from '../../providers/loading/loading.service';
import { NotificationService } from '../../providers/notification/notification.service';
import { RegisterService } from '../../providers/register/register.service';
import { environment } from "../../../environments/environment";
import { ReCaptchaV3Service } from "ng-recaptcha";

const REQUIRED_FIELDS = ['name',
  'address',
  'city',
  'state',
  'zip',
  'dotNumber',
  'msNumber',
  'officePhone',
  'email',
  'contactPersonFirstName',
  'contactPersonLastName',];

@Component({
  selector: 'app-register-carrier',
  templateUrl: './register-carrier.component.html',
  styleUrls: ['./register-carrier.component.scss'],
})
export class RegisterCarrierComponent implements OnInit {
  @Input() invite = true;
  @ViewChild('mcCertificateDoc') mcCertificateDoc;
  @ViewChild('insuranceDoc') insuranceDoc;
  fieldsNotForm = ['mcCertificateUrl', 'insuranceUrl', 'id'];
  validatorAddress$ = new Subject<string>();
  companyId: number;
  filteredOptions: Observable<string[]>;
  errors = {
    name: false,
    address: false,
    city: false,
    state: false,
    zip: false,
    dotNumber: false,
    msNumber: false,
    officePhone: false,
    email: false,
    contactPersonFirstName: false,
    contactPersonLastName: false,
    terms: false,
    insurance: false,
    mcCertificate: false,
  }

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    public route: ActivatedRoute,
    private loadingService: LoadingService,
    private router: Router,
    private fileService: FileService,
    private errorService: ErrorService,
    private hereService: HereService,
    private notificationService: NotificationService,
    private phoneNumberPipe: PhoneNumberPipe,
    private recaptchaV3Service: ReCaptchaV3Service,
  ) { }

  public states = STATES.map(item => item.name);

  @Output() public changeTab: EventEmitter<number> = new EventEmitter();

  public data = this.fb.group({
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    zip: new FormControl('', [Validators.required]),
    dotNumber: new FormControl('', [Validators.required]),
    msNumber: new FormControl('', [Validators.required]),
    officePhone: new FormControl('', [Validators.required, Validators.pattern(REGEX_PHONE)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    contactPersonFirstName: new FormControl('', [Validators.required]),
    contactPersonLastName: new FormControl('', [Validators.required]),
    contactPersonPhone: new FormControl('', [Validators.pattern(REGEX_PHONE)]),
    terms: new FormControl(false, [Validators.requiredTrue]),
  });

  public mcCertificate: FileUploadResponse;
  public insurance: FileUploadResponse;
  private hash: string;

  ngOnInit() {
    const hash = this.route.snapshot.paramMap.get('hash');

    // tslint:disable-next-line:no-non-null-assertion
    this.filteredOptions = this.data.get('state')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filter(value)),
      );

    if (hash && hash.length) {
      this.hash = hash;
      this.invite ?
        this.loadHash(hash) :
        this.validateHash(hash);
    }
    this.onChangePhone();
    this.validatorAddress$.pipe(
      debounceTime(600),
      distinctUntilChanged())
      .subscribe(() => {
        this.checkAddress();
      });
  }

  public addressValidator(address: string, key: string) {
    this.errors[key] = false;
    this.validatorAddress$.next(address);
  }

  public formValidator(key: string) {
    this.errors[key] = false;
  }

  private checkAddress() {
    const { address, city, state, zip } = this.data.value;
    if (address || city || state || zip) {
      this.hereService.validateAddress({
        state,
        address,
        city,
        zipCode: zip,
      })
        .subscribe(
          () => {
            this.setErrors(null);
          },
          () => {
            this.setErrors({ notEquivalent: true });
          });
    }
  }

  private setErrors(err: ValidationErrors | null) {
    const { address, city, state, zip } = this.data.controls;
    address.setErrors(err);
    city.setErrors(err);
    state.setErrors(err);
    zip.setErrors(err);
  }

  private onChangePhone() {
    this.data.valueChanges.subscribe((val) => {
      const { contactPersonPhone, officePhone } = val;
      if (contactPersonPhone && contactPersonPhone.length) {
        const formatPhone = this.phoneNumberPipe.transform(contactPersonPhone);
        this.data.get('contactPersonPhone').patchValue(formatPhone, { emitEvent: false });
      }
      if (officePhone && officePhone.length) {
        const formatPhone = this.phoneNumberPipe.transform(officePhone);
        this.data.get('officePhone').patchValue(formatPhone, { emitEvent: false });
      }
    });
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.states.filter(option => option.toLowerCase().includes(filterValue));
  }

  private loadHash(hash: string) {
    this.loadingService.startLoading();
    this.registerService.validateToken({ hash })
      .subscribe(
        (res) => {
          const company = res.invite.company;
          Object.keys(company).forEach((key) => {
            if (this.data.controls[key] && company[key]) {
              this.data.controls[key].setValue(company[key]);
              this.data.controls[key].disable();
              this.data
            }
          });
          this.loadingService.stopLoading();
        },
        (err) => {
          this.loadingService.stopLoading();
          this.errorService.navigate(err);
        });
  }

  private setUrl(url: string) {
    const matchesUrl = url.match(/\/([^\/?#]+)[^\/]*$/);
    if (matchesUrl.length > 1) {
      return matchesUrl[1];
    }
    return url;
  }

  private validateHash(hash: string) {
    this.loadingService.startLoading();
    this.registerService.getByHash(hash)
      .subscribe(
        (res) => {
          Object.keys(res).forEach((key) => {
            if (this.data.controls[key] && res[key]) {
              this.data.controls[key].setValue(res[key]);
            }
            this.data.controls.email.disable();
            this.data.controls.terms.setValue(true);
            this.insurance = { signedUrl: res.insuranceUrl, url: this.setUrl(res.insuranceUrl) };
            this.mcCertificate = { signedUrl: res.mcCertificateUrl, url: this.setUrl(res.mcCertificateUrl) };
          });
          this.companyId = res.id;
          this.loadingService.stopLoading();
        },
        (err) => {
          this.loadingService.stopLoading();
          this.errorService.navigate(err);
        });
  }

  private validateKeys(keys: string[]): boolean {
    return keys.some(key => this.data.get(key).disabled ? false : !this.data.get(key).valid);
  }

  public validateFields() {
    return this.validateKeys(REQUIRED_FIELDS);
  }

  private getValue(key) {
    return this.data.get(key).value;
  }

  private uploadFile(file: File): Promise<FileUploadResponse> {
    if (!file) {
      return;
    }
    if (file.size / 1024 / 1024 > 1) {
      this.notificationService.error('File is bigger than 1MB');
      return;
    }
    this.loadingService.startLoading();
    return new Promise((resolve, reject) => {
      this.fileService.upload(file)
        .subscribe(
          (res) => {
            this.loadingService.stopLoading();
            resolve(res);
          },
          (err) => {
            this.loadingService.stopLoading();
            reject(err);
          });
    });
  }

  verifyErrors() {
    REQUIRED_FIELDS.forEach(key => {
      this.errors[key] = this.data.get(key).disabled ? false : !this.data.get(key).valid;
    })
    this.errors.terms = !this.data.get('terms').valid;
    this.errors.insurance = !this.insurance;
    this.errors.mcCertificate = !this.mcCertificate;
  }

  public checkRegister() {
    this.verifyErrors();
    const terms = this.getValue('terms');
    if (!terms || this.validateFields() || !this.insurance || !this.mcCertificate) {
      return;
    }
    this.loadingService.startLoading();

    const data = {
      mcCertificateUrl: this.mcCertificate.url || this.mcCertificate.signedUrl,
      insuranceUrl: this.insurance.url || this.insurance.signedUrl,
      name: this.getValue('name'),
      address: this.getValue('address'),
      city: this.getValue('city'),
      state: this.getValue('state'),
      zip: this.getValue('zip'),
      dotNumber: parseInt(this.getValue('dotNumber'), 10),
      msNumber: parseInt(this.getValue('msNumber'), 10),
      officePhone: this.getValue('officePhone'),
      contactPersonFirstName: this.getValue('contactPersonFirstName'),
      contactPersonLastName: this.getValue('contactPersonLastName'),
      contactPersonPhone: this.getValue('contactPersonPhone'),
      email: this.getValue('email'),
      termsOfServiceAccepted: this.getValue('terms'),
    };
    if (this.invite) {
      this.register({
        ...data,
        hash: this.hash,
      });
    } else {
      this.changeCompany(data);
    }
  }

  private changeCompany(data) {
    this.registerService.updateCarrier({
      ...data,
      id: this.companyId,
      token: this.hash,
    })
      .subscribe(() => {
        this.notificationService.success('Success edit!');
        this.router.navigateByUrl(`/${APP_ROUTES.waiting}/requested-changes`);
      });
  }

  public async register(data) {

    if (environment.recatchaEnabled) {
      this.recaptchaV3Service.execute('register_common')
        .subscribe((token) => {
          data.token = token;
          return this.doRegister(data);
        });
      return;
    }
    return this.doRegister(data);
  }

  private async doRegister(data) {
    if (this.hash) {
      delete data.email;
      this.registerService.carrier(data)
        .subscribe((res) => {
          this.finishRegister(res.hash);
        });
    } else {
      this.registerService.carrierNew(data)
        .subscribe((res) => {
          this.finishRegister(res.hash);
        });
    }
  }

  private finishRegister(hash: string) {
    this.loadingService.stopLoading();
    this.router.navigateByUrl(`/${APP_ROUTES.register_carrier_finish}/${hash}`);
  }

  public login() {
    if (this.router.url === '/auth') {
      this.changeTab.emit(0);
    } else {
      this.router.navigateByUrl('/auth');
    }
  }

  public async selectMcCertificate(file: File) {
    this.mcCertificateDoc.nativeElement.value = null;
    this.mcCertificate = await this.uploadFile(file);
    this.errors.mcCertificate = false;
  }

  public async selectInsurance(file: File) {
    this.insuranceDoc.nativeElement.value = null;
    this.insurance = await this.uploadFile(file);
    this.errors.insurance = false;
  }

  public openTermService() {
    const url = this.router.serializeUrl(this.router.createUrlTree([APP_ROUTES.terms]));
    window.open(url, '_blank');
  }
}
