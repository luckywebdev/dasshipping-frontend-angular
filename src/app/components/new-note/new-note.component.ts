import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { LoadingService } from '../../providers/loading/loading.service';
import { OrderService } from '../../providers/order/order.service';

interface DialogData {
  id: number;
}

@Component({
  selector: 'app-new-note',
  templateUrl: './new-note.component.html',
  styleUrls: ['./new-note.component.scss'],
})
export class NewNoteComponent {
  public message: string;
  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private loadingService: LoadingService,
    public dialogRef: MatDialogRef<NewNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  public dataForm = this.fb.group({
    orderId: new FormControl(this.data.id, [Validators.required]),
    note: new FormControl('', [Validators.required]),
  });

  public create() {
    this.loadingService.startLoading();
    this.orderService.createNote(this.dataForm.value)
      .subscribe(
        (res) => {
          this.dialogRef.close(res);
          this.loadingService.stopLoading();
        },
        () => {
          this.dialogRef.close();
          this.loadingService.stopLoading();
        });
  }

}
