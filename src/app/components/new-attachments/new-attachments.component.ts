import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

interface DialogData {
  name: string;
}

@Component({
  selector: 'app-new-attachments',
  templateUrl: './new-attachments.component.html',
  styleUrls: ['./new-attachments.component.scss'],
})
export class NewAttachmentComponent {
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewAttachmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  public dataForm = this.fb.group({
    name: new FormControl(this.data.name, [Validators.required]),
  });

  public sendNewAttachment() {
    this.dialogRef.close(this.dataForm.value.name);
  }
}
