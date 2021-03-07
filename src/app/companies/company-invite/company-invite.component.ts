import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';

import { CarrierInviteRequest } from '../../interfaces/models';
import { LoadingService } from '../../providers/loading/loading.service';
import { RegisterService } from '../../providers/register/register.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-company-invite',
  templateUrl: './company-invite.component.html',
  styleUrls: ['./company-invite.component.scss'],
})
export class CompanyInviteComponent {
  errorMessage: string;
  orderId: number;
  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private loadingService: LoadingService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CompanyInviteComponent>,
    @Inject(MAT_DIALOG_DATA) data,
  ) {
    if (data && data.orderId) {
      this.orderId = data.orderId;
    }
  }

  public dataForm = this.fb.group({
    name: new FormControl('', [Validators.required]),
    contactPersonFirstName: new FormControl('', [Validators.required]),
    contactPersonLastName: new FormControl('', [Validators.required]),
    msNumber: new FormControl('', [Validators.required]),
    dotNumber: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  private getValue(key) {
    return this.dataForm.get(key).value;
  }

  public closeError() {
    this.errorMessage = null;
  }

  public invite() {
    let data: CarrierInviteRequest = {
      name: this.getValue('name'),
      contactPersonFirstName: this.getValue('contactPersonFirstName'),
      contactPersonLastName: this.getValue('contactPersonLastName'),
      msNumber: this.getValue('msNumber').toString(),
      dotNumber: this.getValue('dotNumber').toString(),
      email: this.getValue('email'),
    };

    if (this.orderId) {
      data = { ...data, orderId: this.orderId };
    }

    this.loadingService.startLoading();
    this.registerService.getInviteExists(data.dotNumber, data.msNumber)
      .subscribe(
        (res) => {
          this.loadingService.stopLoading();
          if (res && res.id) {
            this.checkInvite(data);
          } else {
            this.sendInvite(data);
          }
        },
        () => {
          this.loadingService.stopLoading();
          this.sendInvite(data);
        });
  }

  private checkInvite(data: CarrierInviteRequest) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm',
        description: 'This operation will cancel the dispatch invite you sent previously to this carrier.',
        nameButton: 'Ok',
        reason: false,
      },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.sendInvite(data);
        }
      });
  }

  public sendInvite(data: CarrierInviteRequest) {
    this.loadingService.startLoading();
    this.registerService.inviteCarrier(data)
      .subscribe(
        (res) => {
          this.loadingService.stopLoading();
          this.dialogRef.close(res);
        },
        (error) => {
          this.errorMessage = error && error.error && error.error.message;
          this.loadingService.stopLoading();
        });
  }
}
