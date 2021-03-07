import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { COMPANY_STATUSES, REGEX_PHONE } from '../../constants';
import { STATES } from '../../constants/states.constant';
import { ROLES_STATUS } from '../../enums';
import { AccountDTO, AccountFilesDTO, CompanyDTO } from '../../interfaces/models';
import { PhoneNumberPipe } from '../../pipes/number-phone';
import { CompanyService } from '../../providers/company/company.service';
import { FileService } from '../../providers/file/file.service';
import { HereService } from '../../providers/here/here.service';
import { LoadingService } from '../../providers/loading/loading.service';
import { NotificationService } from '../../providers/notification/notification.service';
import { UserService } from '../../providers/user/user.service';
import { NewAttachmentComponent } from '../new-attachments/new-attachments.component';

@Component({
  selector: 'app-my-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class MyCompanyComponent implements OnInit {
  @ViewChild('document') document;
  user: AccountDTO;
  company: CompanyDTO;
  editable = false;
  cover_photo: string;
  filteredOptions: Observable<string[]>;
  public states = STATES.map(item => item.name);
  validatorAddress$ = new Subject<string>();
  companyStatuses = COMPANY_STATUSES;
  roles = ROLES_STATUS;
  readonly = true;

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private companyService: CompanyService,
    private hereService: HereService,
    private fileService: FileService,
    private notificationService: NotificationService,
    private phoneNumberPipe: PhoneNumberPipe,
    private userService: UserService,
    public dialog: MatDialog,
  ) { }

  public data = this.fb.group({
    contactPersonPhone: new FormControl('', [Validators.pattern(REGEX_PHONE)]),
    address: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    officePhone: new FormControl('', [Validators.required, Validators.pattern(REGEX_PHONE)]),
    zip: new FormControl('', [Validators.required]),
    blocked: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.loadingService.startLoading();
    this.user = this.userService.user;
    this.getCompany();

    // tslint:disable-next-line:no-non-null-assertion
    this.filteredOptions = this.data.get('state')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filter(value)),
      );
    this.onChangePhone();
    this.validatorAddress$.pipe(
      debounceTime(600),
      distinctUntilChanged())
      .subscribe(() => {
        this.checkAddress();
      });
  }

  public editMode() {
    this.readonly = !this.readonly;
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

  private getCompany() {
    this.companyService.get()
      .subscribe((res) => {
        this.company = res;
        this.cover_photo = this.company.avatarUrl;
        this.data.patchValue({ blocked: res.blocked });
        this.loadingService.stopLoading();
      });
  }

  public edit() {
    this.editable = !this.editable;
    if (this.editable) {
      Object.keys(this.company).forEach((key) => {
        if (this.data.controls[key] && this.company[key]) {
          this.data.controls[key].setValue(this.company[key]);
        }
      });
    }
  }

  private getValue(key) {
    return this.data.get(key).value;
  }

  public save() {
    this.loadingService.startLoading();
    const data = {
      contactPersonPhone: this.getValue('contactPersonPhone'),
      address: this.getValue('address'),
      state: this.getValue('state'),
      city: this.getValue('city'),
      officePhone: this.getValue('officePhone'),
      zip: this.getValue('zip'),
      blocked: this.getValue('blocked'),
    };
    this.updateCompany(data);
  }

  private updateCompany(data = {}) {
    this.companyService.update(
      {
        ...this.company,
        ...data,
        avatarUrl: this.cover_photo,
      })
      .subscribe((res) => {
        this.editable = false;
        this.company = { ...this.company, ...res };
        this.loadingService.stopLoading();
      });
  }

  public uploadPhoto(file: File) {
    if (!file) {
      return;
    }
    this.loadingService.startLoading();
    this.fileService.upload(file)
      .subscribe((res) => {
        this.cover_photo = res.signedUrl;
        this.loadingService.stopLoading();
        this.notificationService.success('Successfully uploaded');
      });
  }

  public removeCover() {
    this.cover_photo = null;
  }

  public uploadDocument(file: File, type: string) {
    if (!file) {
      return;
    }
    this.loadingService.startLoading();
    this.fileService.upload(file)
      .subscribe((res) => {
        this.company[type] = res.signedUrl;
        this.loadingService.stopLoading();
        this.notificationService.success('Successfully uploaded');
      });
  }

  public checkApprove() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        action: 'Confirm Approve Company',
        description: 'Are you sure?',
        nameButton: 'Approve',
        reason: false,
      },
      width: '450px',
    });
    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.approveCompany();
        }
      });
  }

  private approveCompany() {
    this.loadingService.startLoading();
    this.companyService.aproveCompany(this.company.id)
      .subscribe(
        () => {
          this.company.status = COMPANY_STATUSES.ACTIVE;
          this.loadingService.stopLoading();
          this.notificationService.success('Success approved!');
        },
        () => {
          this.loadingService.stopLoading();
        });
  }

  public requestChanges() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        action: 'Request Changes',
        description: '',
        nameButton: 'Send',
        reason: true,
        placeholder: 'Changes...',
        maxlength: 400,
      },
      width: '450px',
    });
    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.companyService.requestChangesCompany({ id: this.company.id, message: result })
            .subscribe(() => {
              this.notificationService.success('Success send!');
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
          this.company.files = this.company.files.filter(file => file.id !== id);
          this.updateCompany({ files: this.company.files });
        }
      });
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
          this.company.files = [{
            displayName,
            path: res.url,
          }, ...this.company.files];
          this.updateCompany({ files: this.company.files });
        },
        () => {
          this.loadingService.stopLoading();
        });
  }
}
