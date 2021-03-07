import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

interface DialogData {
  orderId: number;
  dispatcher: string;
  driver: string;
}

@Component({
  selector: 'app-choose-dispatcher',
  templateUrl: './choose-dispatcher.component.html',
  styleUrls: ['./choose-dispatcher.component.scss'],
})
export class ChooseDispatcherComponent implements OnInit {
  public message: string;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChooseDispatcherComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  public dataForm = this.fb.group({
    orderId: new FormControl('', [Validators.required]),
    dispatcher: new FormControl('', [Validators.required]),
    driver: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
  }

  public assignDispatcher() {
    console.log('assignDispatcher');
  }
}
