import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { APP_ROUTES } from '../../app.constants';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { JoinDriverComponent } from '../../components/drivers/drivers.component';
import { NewAttachmentComponent } from '../../components/new-attachments/new-attachments.component';
import { GENDERS, LANGUAGES, REGEX_PHONE, SET_ROLES, TRAILER_TYPE } from '../../constants';
import { ROLES_ENUM, ROLES_STATUS } from '../../enums';
import {
  AccountDTO,
  AccountFilesDTO,
  PatchUserRequest,
  PolicyDTO,
  RequestTrailerDTO,
  RequestTruckDTO,
} from '../../interfaces/models';
import { PhoneNumberPipe } from '../../pipes/number-phone';
import { CarService } from '../../providers/car/car.service';
import { FileService } from '../../providers/file/file.service';
import { HereService } from '../../providers/here/here.service';
import { LoadingService } from '../../providers/loading/loading.service';
import { NotificationService } from '../../providers/notification/notification.service';
import { PolicyService } from '../../providers/policy/policy.service';
import { UserService } from '../../providers/user/user.service';

@Component({
  selector: 'app-account-profile',
  templateUrl: './account-profile.component.html',
  styleUrls: ['./account-profile.component.scss'],
})
export class AccountProfileComponent implements OnInit {
  @ViewChild('document') document;
  validatorAddress$ = new Subject<string>();
  id: string;
  user: AccountDTO;
  avatar: string;
  roles = SET_ROLES;
  genders = GENDERS;
  languages = LANGUAGES;
  rolesStatuses = ROLES_STATUS;
  rolesStatus = ROLES_ENUM;
  dispacerDrivers: AccountDTO[] = [];
  dispacerDriversCount = 0;
  skip = 0;
  limit = 10;
  page: number;
  vehicleTypes: PolicyDTO[] = [];
  trailerTypes = TRAILER_TYPE;
  readonly = true;
  readonlyTruck = true;
  readonlyTrailer = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private carService: CarService,
    private loadingService: LoadingService,
    private hereService: HereService,
    private fileService: FileService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    private phoneNumberPipe: PhoneNumberPipe,
    private router: Router,
    private policyService: PolicyService,
  ) { }

  public data = this.fb.group({
    firstName: new FormControl(
      {
        value: '',
        disabled: !this.checkPermission([ROLES_STATUS.DISPATCHER, ROLES_STATUS.COMPANY_ADMIN]),
      },
      [Validators.required]),
    lastName: new FormControl(
      {
        value: '',
        disabled: !this.checkPermission([ROLES_STATUS.DISPATCHER, ROLES_STATUS.COMPANY_ADMIN]),
      },
      [Validators.required]),
    genderId: new FormControl({
      value: '',
      disabled: !this.checkPermission([ROLES_STATUS.DISPATCHER, ROLES_STATUS.COMPANY_ADMIN]),
    }),
    city: new FormControl({
      value: '',
      disabled: !this.checkPermission([ROLES_STATUS.DISPATCHER, ROLES_STATUS.COMPANY_ADMIN]),
    }),
    address: new FormControl({
      value: '',
      disabled: !this.checkPermission([ROLES_STATUS.DISPATCHER, ROLES_STATUS.COMPANY_ADMIN]),
    }),
    languages: new FormControl({
      value: '',
      disabled: !this.checkPermission([ROLES_STATUS.DISPATCHER, ROLES_STATUS.COMPANY_ADMIN]),
    }),
    state: new FormControl({
      value: '',
      disabled: !this.checkPermission([ROLES_STATUS.DISPATCHER, ROLES_STATUS.COMPANY_ADMIN]),
    }),
    zip: new FormControl({
      value: '',
      disabled: !this.checkPermission([ROLES_STATUS.DISPATCHER, ROLES_STATUS.COMPANY_ADMIN]),
    }),
    birthday: new FormControl({
      value: '',
      disabled: !this.checkPermission([ROLES_STATUS.DISPATCHER, ROLES_STATUS.COMPANY_ADMIN]),
    }),
    email: new FormControl(
      {
        value: '',
        disabled: !this.checkPermission([ROLES_STATUS.DISPATCHER, ROLES_STATUS.COMPANY_ADMIN]),
      },
      [Validators.required]),
    dlNumber: new FormControl(
      {
        value: '',
        disabled: !this.checkPermission([ROLES_STATUS.DISPATCHER, ROLES_STATUS.COMPANY_ADMIN]),
      }),
    phoneNumber: new FormControl(
      {
        value: '',
        disabled: !this.checkPermission([ROLES_STATUS.DISPATCHER, ROLES_STATUS.COMPANY_ADMIN]),
      },
      [Validators.pattern(REGEX_PHONE)]),
    payRate: new FormControl(
      {
        value: '',
        disabled: !this.checkPermission([ROLES_STATUS.COMPANY_ADMIN]),
      }),
  });

  public truck = this.fb.group({
    VINNumber: new FormControl({
      value: '',
      disabled: !this.checkPermission([ROLES_STATUS.DISPATCHER, ROLES_STATUS.COMPANY_ADMIN]),
    }),
    type: new FormControl(
      {
        value: '',
        disabled: !this.checkPermission([ROLES_STATUS.DISPATCHER, ROLES_STATUS.COMPANY_ADMIN]),
      },
      [Validators.required]),
    fuelPerMile: new FormControl({
      value: '',
      disabled: !this.checkPermission([ROLES_STATUS.DISPATCHER, ROLES_STATUS.COMPANY_ADMIN]),
    }),
    make: new FormControl({
      value: '',
      disabled: !this.checkPermission([ROLES_STATUS.DISPATCHER, ROLES_STATUS.COMPANY_ADMIN]),
    }),
    model: new FormControl({
      value: '',
      disabled: !this.checkPermission([ROLES_STATUS.DISPATCHER, ROLES_STATUS.COMPANY_ADMIN]),
    }),
    year: new FormControl(),
    accountId: new FormControl(
      {
        value: '',
        disabled: !this.checkPermission([ROLES_STATUS.DISPATCHER, ROLES_STATUS.COMPANY_ADMIN]),
      },
      [Validators.required]),
  });

  public trailer = this.fb.group({
    VINNumber: new FormControl({
      value: '',
      disabled: !this.checkPermission([ROLES_STATUS.DISPATCHER, ROLES_STATUS.COMPANY_ADMIN]),
    }),
    type: new FormControl(
      {
        value: '',
        disabled: !this.checkPermission([ROLES_STATUS.DISPATCHER, ROLES_STATUS.COMPANY_ADMIN]),
      },
      [Validators.required]),
    capacity: new FormControl({
      value: '',
      disabled: !this.checkPermission([ROLES_STATUS.DISPATCHER, ROLES_STATUS.COMPANY_ADMIN]),
    }),
    make: new FormControl({
      value: '',
      disabled: !this.checkPermission([ROLES_STATUS.DISPATCHER, ROLES_STATUS.COMPANY_ADMIN]),
    }),
    model: new FormControl({
      value: '',
      disabled: !this.checkPermission([ROLES_STATUS.DISPATCHER, ROLES_STATUS.COMPANY_ADMIN]),
    }),
    year: new FormControl(),
    accountId: new FormControl(
      {
        value: '',
        disabled: !this.checkPermission([ROLES_STATUS.DISPATCHER, ROLES_STATUS.COMPANY_ADMIN]),
      },
      [Validators.required]),
  });

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.setInitialData();
      } else {
        this.router.navigate([APP_ROUTES.orders]);
      }
    });
  }

  public openEdit() {
    this.readonly = !this.readonly;
  }

  public openEditTruck() {
    this.readonlyTruck = !this.readonlyTruck;
  }

  public openEditTrailer() {
    this.readonlyTrailer = !this.readonlyTrailer;
  }

  private getPolicy() {
    this.policyService.getList().subscribe((res) => {
      this.vehicleTypes = [{ id: 0, type: undefined, price: 0 }, ...res.data];
    });
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

  public permissionPayRate() {
    const { user } = this.userService;
    return this.user && user && [ROLES_ENUM.DRIVER, ROLES_ENUM.DISPATCHER].includes(this.user.roleId) &&
      [ROLES_ENUM.SUPER_ADMIN, ROLES_ENUM.COMPANY_ADMIN].includes(user.roleId);
  }

  private permissionPayRateEdit() {
    const { user } = this.userService;
    return this.user && user && [ROLES_ENUM.DRIVER, ROLES_ENUM.DISPATCHER].includes(this.user.roleId) &&
      [ROLES_ENUM.COMPANY_ADMIN].includes(user.roleId);
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
    this.userService.getById(this.id)
      .subscribe((res) => {
        this.user = res;
        switch (res.roleId) {
          case this.rolesStatuses.DRIVER:
            this.setCars();
            this.getPolicy();
            break;
          case this.rolesStatuses.DISPATCHER:
            this.getDrivers();
            break;
        }
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

  private getDrivers() {
    this.userService.getListDrivers(this.user.id, this.skip, this.limit)
      .subscribe((res) => {
        this.dispacerDrivers = res.data;
        this.dispacerDriversCount = res.count;
        this.page = (this.skip / this.limit) + 1;
        if (this.loadingService.loading) {
          this.loadingService.stopLoading();
        }
      });
  }

  public prevPage() {
    if (this.skip > 0) {
      this.skip = this.skip - this.limit;
      this.loadingService.startLoading();
      this.getDrivers();
    }
  }

  public nextPage() {
    if ((this.skip + this.limit) < this.dispacerDriversCount) {
      this.skip = this.skip + this.limit;
      this.loadingService.startLoading();
      this.getDrivers();
    }
  }

  private setCars() {
    if (this.getPermission(this.rolesStatuses.DRIVER)) {
      if (this.user.truck) {
        Object.keys(this.user.truck).forEach((key) => {
          if (this.truck.controls[key] && this.user.truck[key]) {
            this.truck.controls[key].setValue(this.user.truck[key]);
          }
        });
      }
      if (this.user.trailer) {
        Object.keys(this.user.trailer).forEach((key) => {
          if (this.trailer.controls[key] && this.user.trailer[key]) {
            this.trailer.controls[key].setValue(this.user.trailer[key]);
          }
        });
      }
      this.trailer.controls.accountId.setValue(this.user.id);
      this.truck.controls.accountId.setValue(this.user.id);
    }
  }

  public getPermission(roleId: number) {
    return this.user && this.user.roleId === roleId;
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

    let data: PatchUserRequest = {
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
    };
    if (this.permissionPayRateEdit()) {
      data = { ...data, payRate: parseInt(this.getValue('data', 'payRate'), 10) };
    }
    this.callRequest(data);
  }

  private callRequest(data: PatchUserRequest) {
    (this.id === 'me' ? this.userService.updateMyProfile(data) : this.userService.patch(this.id, data))
      .subscribe((res) => {
        this.readonly = !this.readonly;
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

  private saveTrailer(data: RequestTrailerDTO) {
    this.carService.createTrailer(data)
      .subscribe((res) => {
        this.user.trailer = res;
        this.loadingService.stopLoading();
      });
  }

  private updateTrailer(data: RequestTrailerDTO) {
    this.carService.setTrailer(this.user.trailer.id, data)
      .subscribe((res) => {
        this.user.trailer = res;
        this.loadingService.stopLoading();
      });
  }

  private saveTruck(data: RequestTruckDTO) {
    this.carService.createTrack(data)
      .subscribe((res) => {
        this.user.truck = res;
        this.loadingService.stopLoading();
      });
  }

  private updateTruck(data: RequestTruckDTO) {
    this.carService.setTrack(this.user.truck.id, data)
      .subscribe((res) => {
        this.user.truck = res;
        this.loadingService.stopLoading();
      });
  }

  public verifyTruck() {
    const data: RequestTruckDTO = {
      accountId: this.getValue('truck', 'accountId'),
      VINNumber: this.getValue('truck', 'VINNumber'),
      type: this.getValue('truck', 'type'),
      fuelPerMile: this.getValue('truck', 'fuelPerMile'),
      make: this.getValue('truck', 'make'),
      model: this.getValue('truck', 'model'),
      year: parseInt(this.getValue('truck', 'year'), 10),
    };
    this.loadingService.startLoading();
    if (this.user.truck && this.user.truck.id) {
      this.updateTruck(data);
    } else {
      this.saveTruck(data);
    }
    this.readonlyTruck = !this.readonlyTruck;
  }

  public verifyTrailer() {
    const data: RequestTrailerDTO = {
      accountId: this.getValue('trailer', 'accountId'),
      VINNumber: this.getValue('trailer', 'VINNumber'),
      type: this.getValue('trailer', 'type'),
      capacity: this.getValue('trailer', 'capacity'),
      make: this.getValue('trailer', 'make'),
      model: this.getValue('trailer', 'model'),
      year: parseInt(this.getValue('trailer', 'year'), 10),
    };
    this.loadingService.startLoading();
    if (this.user.trailer && this.user.trailer.id) {
      this.updateTrailer(data);
    } else {
      this.saveTrailer(data);
    }
    this.readonlyTrailer = !this.readonlyTrailer;
  }

  public uploadAttachments(file: File) {
    const dialogRef = this.dialog.open(NewAttachmentComponent, {
      width: '450px',
      data: {
        name: '',
      },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.createAttachment(file, result);
        }
      });
  }

  private createAttachment(file: File, displayName: string) {
    if (!file.name) {
      this.notificationService.error('Please select File');
      return;
    }
    this.loadingService.startLoading();
    this.document.nativeElement.value = null;
    this.fileService.upload(file)
      .subscribe(
        (res) => {
          this.user.files = [{
            displayName,
            path: res.url,
          }, ...this.user.files];
          this.callRequest({ files: this.user.files });
        },
        () => {
          this.loadingService.stopLoading();
        });
  }

  public removeAttachment(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm Remove',
        description: 'Are you sure?',
        nameButton: 'Confirm',
        reason: false,
      },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.user.files = this.user.files.filter(file => file.id !== id);
          this.callRequest({ files: this.user.files });
        }
      });
  }

  public removeDriverToDispacher(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm Remove',
        description: 'Are you sure?',
        nameButton: 'Confirm',
        reason: false,
      },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loadingService.startLoading();
          this.userService.unlinkDriver(this.user.id, id)
            .subscribe(() => {
              this.dispacerDrivers = this.dispacerDrivers.filter(drive => drive.id !== id);
              this.loadingService.stopLoading();
            });
        }
      });
  }

  public addDriverToDispacher() {
    const dialogRef = this.dialog.open(JoinDriverComponent, {
      width: '450px',
      height: '450px',
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loadingService.startLoading();
          this.userService.joinDriverToDispacher(this.user.id, result.id)
            .subscribe(() => {
              this.dispacerDrivers = [result, ...this.dispacerDrivers];
              this.loadingService.stopLoading();
            });
        }
      });
  }

  public downloadAttachment(file: AccountFilesDTO) {
    this.loadingService.startLoading();
    this.userService.getFileSign(file.path)
      .subscribe((resp) => {
        window.open(resp.url, '_parent');
        this.loadingService.stopLoading();
      });
  }

  public viewCompany() {
    this.router.navigate([APP_ROUTES.company, this.user.company.id]);
  }

  public goToAccount(id: number) {
    this.router.navigate([APP_ROUTES.accounts, id]);
  }

  public checkPermission(roles: number[]) {
    return roles.includes(this.userService.user.roleId);
  }

  public suspendAccount() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm Suspend Account',
        description: 'Are you sure?',
        nameButton: 'Confirm',
        reason: false,
      },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loadingService.startLoading();
          this.userService.blockAccount(this.user.id)
            .subscribe(() => {
              this.user = { ...this.user, blocked: true };
              this.loadingService.stopLoading();
            });
        }
      });
  }

  public activateAccount() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm account activation',
        description: 'Are you sure?',
        nameButton: 'Confirm',
        reason: false,
      },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loadingService.startLoading();
          this.userService.blockAccount(this.user.id, false)
            .subscribe(() => {
              this.user = { ...this.user, blocked: false };
              this.loadingService.stopLoading();
            });
        }
      });
  }

  public unlinkDispetcher() {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm Remove',
        description: 'Are you sure?',
        nameButton: 'Confirm',
        reason: false,
      },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loadingService.startLoading();
          this.userService.unlinkDriver(this.user.dispatcher.id, this.user.id)
            .subscribe(() => {
              this.user = { ...this.user, dispatcher: null };
              this.loadingService.stopLoading();
            });
        }
      });
  }

  public kickOutAccount() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm Kick out',
        description: 'Please confirm your action',
        nameButton: 'Confirm',
        reason: false,
      },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loadingService.startLoading();
          this.userService.leaveCompany(this.user.id)
            .subscribe(() => {
              this.user = { ...this.user, dispatcher: null };
              this.loadingService.stopLoading();
              this.router.navigate([APP_ROUTES.accounts]);
            });
        }
      });
  }

  public checkIsDriver() {
    return [ROLES_STATUS.COMPANY_ADMIN].includes(this.userService.user.roleId) && this.user && this.user.roleId === ROLES_STATUS.DRIVER;
  }

  public checkSuspendAccount() {
    const { user } = this.userService;
    if (ROLES_STATUS.COMPANY_ADMIN === user.roleId && this.user && this.user && this.user.roleId === ROLES_STATUS.DRIVER) {
      return false;
    }
    return [ROLES_STATUS.SUPER_ADMIN, ROLES_STATUS.COMPANY_ADMIN].includes(user.roleId) &&
      this.user && this.id !== 'me';
  }
}
