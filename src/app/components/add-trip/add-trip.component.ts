import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { TripDTO } from '../../interfaces/models';
import { LoadingService } from '../../providers/loading/loading.service';
import { TripService } from '../../providers/trip/trip.service';

interface DialogData {
  orderId: number;
  tripId: number;
}

@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.scss'],
})
export class AddTripComponent implements OnInit {
  trips: TripDTO[] = [];
  limit = 10;
  skip = 0;
  count = 0;

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private loadingService: LoadingService,
    public dialogRef: MatDialogRef<AddTripComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  public dataForm = this.fb.group({
    tripId: new FormControl('', [Validators.required]),
    orderId: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.getTrips();
    this.dataForm.controls.orderId.setValue(this.data.orderId);
    this.dataForm.controls.tripId.setValue(this.data.tripId);
  }

  public addToTrip() {
    this.loadingService.startLoading();
    const { orderId, tripId } = this.dataForm.value;
    this.tripService.assignOrder(tripId, orderId)
      .subscribe((res) => {
        this.dialogRef.close(res);
        this.loadingService.stopLoading();
      });
  }

  private getTrips() {
    this.tripService.getList({
      limit: this.limit,
      offset: this.skip,
      status: 'actives'
    })
      .subscribe((res) => {
        const trips = res.data;
        this.trips = [...this.trips, ...trips];
        this.count = res.count;
      });
  }

  public getListTrips() {
    if (this.trips.length < this.count) {
      this.skip = this.skip + this.limit;
      this.getTrips();
    }
  }
}
