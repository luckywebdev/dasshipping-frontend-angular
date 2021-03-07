import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

interface DialogData {
  dueDate?: Date;
  textHeader: string;
  textButton: string;
  checkDate: boolean;
}
@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss'],
})
export class SendEmailComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SendEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  public invoice = this.fb.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    dueDate: new FormControl(''),
  });

  ngOnInit() {
    if (this.data && this.data.dueDate) {
      this.invoice.controls.dueDate.setValue(this.data.dueDate);
    }
    if (this.data.checkDate) {
      this.invoice.controls.dueDate.setValidators([Validators.required]);
    }
  }

  public sendInvoice() {
    let body: any = {
      email: this.invoice.controls.email.value,
    };
    if (this.data.checkDate) {
      body = { ...body, dueDate: this.invoice.controls.dueDate.value };
    }
    this.dialogRef.close(body);
  }
}
