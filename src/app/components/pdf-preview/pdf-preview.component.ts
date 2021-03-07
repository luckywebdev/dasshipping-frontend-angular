import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

interface DialogData {
  textHeader: string;
  textButton: string;
  cancelButton: string;
  link: string;
}

@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.scss'],
})
export class PdfPreviewComponent {
  constructor(
    public dialogRef: MatDialogRef<PdfPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
  }

  public send() {
    this.dialogRef.close(true);
  }
}
