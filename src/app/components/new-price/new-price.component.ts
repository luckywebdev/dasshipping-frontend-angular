import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { LoadingService } from '../../providers/loading/loading.service';
import { OrderService } from '../../providers/order/order.service';

interface DialogData {
  id: number;
}

@Component({
  selector: 'app-new-price',
  templateUrl: './new-price.component.html',
  styleUrls: ['./new-price.component.scss'],
})
export class NewDiscountComponent {
  public message: string;
  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private loadingService: LoadingService,
    public dialogRef: MatDialogRef<NewDiscountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  public dataForm = this.fb.group({
    id: new FormControl(this.data.id, [Validators.required]),
    discount: new FormControl('', [Validators.required]),
  });

  public sendNewDiscount() {
    this.loadingService.startLoading();
    this.orderService.offerrDiscount(this.dataForm.value)
      .subscribe(
        (res) => {
          this.dialogRef.close(res);
          this.loadingService.stopLoading();
        },
        () => {
          this.loadingService.stopLoading();
          this.dialogRef.close();
        });
  }
}
