import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { PolicyCreateRequest, PolicyDTO } from '../../interfaces/models';
import { LoadingService } from '../../providers/loading/loading.service';
import { NotificationService } from '../../providers/notification/notification.service';
import { PolicyService } from '../../providers/policy/policy.service';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss'],
})
export class PolicyComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private policyService: PolicyService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<PolicyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PolicyDTO,
  ) { }

  public price = this.fb.group({
    type: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    if (this.data && this.data.id) {
      this.price.controls.price.setValue(this.data.price);
      this.price.controls.type.setValue(this.data.type);
    }
  }

  private getValue(key) {
    return this.price.get(key).value;
  }

  public callFun() {
    this.loadingService.startLoading();
    const data = {
      type: this.getValue('type'),
      price: this.getValue('price'),
    };
    if (this.data && this.data.id) {
      this.edit(data);
    } else {
      this.create(data);
    }
  }

  private create(data: PolicyCreateRequest) {
    this.policyService.create(data)
      .subscribe((res) => {
        this.dialogRef.close(res);
        this.notificationService.success('Policy success created!');
        this.loadingService.stopLoading();
      });
  }

  private edit(data: PolicyCreateRequest) {
    this.policyService.update(this.data.id, data)
      .subscribe((res) => {
        this.dialogRef.close(res);
        this.notificationService.success('Policy success updated!');
        this.loadingService.stopLoading();
      });
  }

}
