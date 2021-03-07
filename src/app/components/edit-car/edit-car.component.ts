import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import {LoadingService} from '../../providers/loading/loading.service';
import {CarDTO} from '../../interfaces/carDTO';
import {PolicyDTO} from '../../interfaces/models';
import {PolicyService} from '../../providers/policy/policy.service';
import {CarService} from '../../providers/car/car.service';

interface DialogData {
  car: CarDTO;
}

@Component({
  selector: 'app-edit-car',
  templateUrl: './edit-car.component.html',
  styleUrls: ['./edit-car.component.scss'],
})
export class EditCarComponent implements OnInit {
  vehicleTypes: PolicyDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private policyService: PolicyService,
    private carService: CarService,
    public dialogRef: MatDialogRef<EditCarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  public dataForm = this.fb.group({
    label: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    make: new FormControl('', [Validators.required]),
    model: new FormControl('', [Validators.required]),
    year: new FormControl('', [Validators.required]),
    inop: new FormControl(),
  });

  ngOnInit() {
    this.setData();
    this.getPolicy();
  }

  private setData() {
    const {car} = this.data;
    Object.keys(car).forEach(key => {
      if (this.dataForm.controls[key] && car[key]) {
        this.dataForm.controls[key].setValue(car[key]);
      }
    });
    this.dataForm.controls.label.setValue(
      `${car.year} ${car.make} ${car.model}  ${car.type ? ', ' + car.type : ''}`
    );
    this.dataForm.controls.label.disable();
  }

  private getPolicy() {
    this.policyService.getList().subscribe(res => {
      this.vehicleTypes = [{id: 0, type: undefined, price: 0}, ...res.data];
    });
  }

  private getValue(key: string) {
    return this.dataForm.get(key).value;
  }

  public getInop() {
    return this.dataForm.get('inop').value;
  }

  public editCar() {
    const car = {
      type: this.getValue('type'),
      make: this.getValue('make'),
      model: this.getValue('model'),
      year: this.getValue('year'),
      inop: this.getValue('inop') || false,
    };
    this.loadingService.startLoading();
    this.carService.editCar(this.data.car.id, car).subscribe(res => {
      this.dialogRef.close(res);
      this.loadingService.stopLoading();
    });
  }
}
