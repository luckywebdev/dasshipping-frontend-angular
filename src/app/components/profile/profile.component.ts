import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { GENDERS, LANGUAGES, REGEX_PHONE } from '../../constants';
import { AccountDTO, PatchUserRequest } from '../../interfaces/models';
import { PhoneNumberPipe } from '../../pipes/number-phone';
import { FileService } from '../../providers/file/file.service';
import { HereService } from '../../providers/here/here.service';
import { LoadingService } from '../../providers/loading/loading.service';
import { NotificationService } from '../../providers/notification/notification.service';
import { UserService } from '../../providers/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('document') document;
  validatorAddress$ = new Subject<string>();
  user: AccountDTO;
  avatar: string;
  id: string;
  genders = GENDERS;
  languages = LANGUAGES;
  readonly = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private loadingService: LoadingService,
    private hereService: HereService,
    private fileService: FileService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    private phoneNumberPipe: PhoneNumberPipe,
  ) { }

  public data = this.fb.group({
    firstName: new FormControl(
      '',
      [Validators.required]),
    lastName: new FormControl(
      '',
      [Validators.required]),
    genderId: new FormControl(''),
    city: new FormControl(''),
    address: new FormControl(''),
    languages: new FormControl(''),
    state: new FormControl(''),
    zip: new FormControl(''),
    birthday: new FormControl(''),
    email: new FormControl(
      '',
      [Validators.required]),
    dlNumber: new FormControl(''),
    phoneNumber: new FormControl(
      '',
      [Validators.pattern(REGEX_PHONE)]),
    companyName: new FormControl(''),
  });

  ngOnInit() {
    this.setInitialData();
  }

  public editMode() {
    this.readonly = !this.readonly;
  }

  private setInitialData() {
    this.loadingService.startLoading();
    this.getUser();
    this.onChangePhone();
    this.validatorAddress$.pipe(
      debounceTime(600),
      distinctUntilChanged())
      .subscribe(() => {
        this.checkAddress();
      });
  }

  public addressValidator(address: string) {
    this.validatorAddress$.next(address);
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
      const { phoneNumber } = val;
      if (phoneNumber && phoneNumber.length) {
        const formatPhone = this.phoneNumberPipe.transform(phoneNumber);
        this.data.get('phoneNumber').patchValue(formatPhone, { emitEvent: false });
      }
    });
  }

  private getUser() {
    this.userService.getById('me')
      .subscribe((res) => {
        this.user = res;
        this.avatar = res.avatarUrl;
        Object.keys(this.user).forEach((key) => {
          if (this.data.controls[key] && this.user[key]) {
            this.data.controls[key].setValue(this.user[key]);
          }
        });
        if (this.user.languages && this.user.languages.length) {
          this.data.controls.languages.setValue(this.user.languages.map(item => item.id));
        }
        this.loadingService.stopLoading();
      });
  }

  private getValue(form: string, key: string) {
    return this[form].get(key).value ? this[form].get(key).value : undefined;
  }

  public save() {
    this.loadingService.startLoading();
    const languageIdsSelected = this.getValue('data', 'languages');
    let languagesSelected = [];
    if (languageIdsSelected && languageIdsSelected.length) {
      languagesSelected = this.languages.filter(item => languageIdsSelected.includes(item.id));
    }

    const data = {
      firstName: this.getValue('data', 'firstName'),
      lastName: this.getValue('data', 'lastName'),
      avatarUrl: this.avatar,
      state: this.getValue('data', 'state'),
      languages: languagesSelected,
      city: this.getValue('data', 'city'),
      address: this.getValue('data', 'address'),
      zip: this.getValue('data', 'zip'),
      birthday: this.userService.toIsoDate(this.getValue('data', 'birthday')),
      phoneNumber: this.getValue('data', 'phoneNumber'),
      genderId: this.getValue('data', 'genderId'),
      companyName: this.getValue('data', 'companyName'),
    };
    this.callRequest(data);
    this.readonly = !this.readonly;
  }

  private callRequest(data: PatchUserRequest) {
    this.userService.updateMyProfile(data)
      .subscribe((res) => {
        this.user = { ...this.user, ...res };
        this.loadingService.stopLoading();
      });
  }

  public removeAvatar() {
    this.avatar = null;
  }

  public uploadAvatar(file: File) {
    if (!file) {
      return;
    }
    this.loadingService.startLoading();
    this.fileService.upload(file)
      .subscribe((res) => {
        console.log(res);
        this.avatar = res.signedUrl;
        this.loadingService.stopLoading();
        this.notificationService.success('Successfully uploaded');
      });
  }

}
