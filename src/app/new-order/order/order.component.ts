import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { APP_ROUTES } from '../../app.constants';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ADDRESS_TYPES, CITIES, REGEX_PHONE, STATES, TRAILER_TYPE } from '../../constants';
import { CarDTO } from '../../interfaces/carDTO';
import { PolicyDTO, ShipperDTO } from '../../interfaces/models';
import { PhoneNumberPipe } from '../../pipes/number-phone';
import { CarService } from '../../providers/car/car.service';
import { HereService } from '../../providers/here/here.service';
import { LoadingService } from '../../providers/loading/loading.service';
import { OrderService } from '../../providers/order/order.service';
import { PolicyService } from '../../providers/policy/policy.service';

interface LoactionEvent {
  value: string;
  key: string;
}
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  cars: CarDTO[] = [];
  validatorVin$ = new Subject<number>();
  validatorAddress$ = new Subject<string>();
  locationType = ADDRESS_TYPES;
  states = STATES.map(item => item.name);
  cities = CITIES;
  statesOptions: string[];
  cityOptions: string[];
  locationState$ = new Subject<LoactionEvent>();
  locationCity$ = new Subject<LoactionEvent>();
  location$ = new Subject<LoactionEvent>();
  locations: any[];
  vehicleTypes: PolicyDTO[] = [];
  trailerTypes = TRAILER_TYPE;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private phoneNumberPipe: PhoneNumberPipe,
    private carService: CarService,
    private loadingService: LoadingService,
    private hereService: HereService,
    private policyService: PolicyService,
    private orderService: OrderService,
    private router: Router,
  ) { }

  public data = this.fb.group({
    trailerType: new FormControl('', [Validators.required]),
  });

  public pickLocation = this.fb.group({
    state: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    zipCode: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    addressType: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(REGEX_PHONE),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    instructions: new FormControl(''),
  });

  public deliveryLocation = this.fb.group({
    state: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    zipCode: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    addressType: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(REGEX_PHONE),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    instructions: new FormControl(''),
  });

  public shipperInformation = this.fb.group({
    address: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(''),
    zipCode: new FormControl(''),
    companyName: new FormControl(''),
    fullName: new FormControl(''),
    phone: new FormControl('', [Validators.pattern(REGEX_PHONE)]),
    email: new FormControl('', [Validators.email]),
    billingEmail: new FormControl('', [Validators.email]),
  });

  ngOnInit() {
    this.subscribeEvents();
    this.getCarTypes();
  }

  private subscribeEvents() {
    this.onChangePhone();
    this.subscribeCarVin();
    this.validateAddress();
    this.subscribeAddress();
    this.subscribeCity();
    this.subscribeState();
  }

  private subscribeState() {
    this.locationState$
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
      )
      .subscribe((data: LoactionEvent) => {
        this.getState(data);
      });
  }

  private subscribeCity() {
    this.locationCity$
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
      )
      .subscribe((data: LoactionEvent) => {
        this.getCity(data);
      });
  }

  private subscribeAddress() {
    this.location$
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
      )
      .subscribe((data: LoactionEvent) => {
        this.getGeocode(data);
      });
  }

  private getGeocode(data: LoactionEvent) {
    const { city, state, zipCode } = this[data.key].value;
    this.hereService
      .getGeocode(
        // tslint:disable-next-line: prefer-template
        `${data.value.trim().toLowerCase()}${zipCode ? ',' + zipCode : ''}${city ? ',' + city : ''}${state ? ',' + state : ''}`,
      )
      .subscribe((res) => {
        this.locations = res;
      });
  }

  private getCity(data: LoactionEvent) {
    const { state } = this[data.key].value;
    let cities = [];
    if (state) {
      cities = this.cities
        .filter(item => item.state.toLowerCase().includes(state.toLowerCase()))
        .map(city => city.city);
    } else {
      cities = this.cities.map(city => city.city);
    }
    this.cityOptions = cities.filter(option =>
      option.toLowerCase().includes(data.value.toLowerCase()),
    );
  }

  public setAddress(form: string) {
    const addressSelected = this[form].value.address;
    const citySelected = this[form].value.city;
    const stateSelected = this[form].value.state;
    const { address, zipCode, city, state } = addressSelected;
    this[form].controls.address.setValue(address);
    this[form].controls.zipCode.setValue(zipCode);
    if (!citySelected) {
      this[form].controls.city.setValue(city);
    }
    if (!stateSelected) {
      this[form].controls.state.setValue(state);
    }
  }

  private getState(data: LoactionEvent) {
    const filterValue = data.value.toLowerCase();

    this.statesOptions = this.states.filter(option =>
      option.toLowerCase().includes(filterValue),
    );
  }

  private onChangePhone() {
    this.pickLocation.valueChanges
      .subscribe((val) => {
        const { phone } = val;
        if (phone && phone.length) {
          const formatPhone = this.phoneNumberPipe.transform(phone);
          this.pickLocation
            .get('phone')
            .patchValue(formatPhone, { emitEvent: false });
        }
      });
    this.deliveryLocation.valueChanges
      .subscribe((val) => {
        const { phone } = val;
        if (phone && phone.length) {
          const formatPhone = this.phoneNumberPipe.transform(phone);
          this.deliveryLocation
            .get('phone')
            .patchValue(formatPhone, { emitEvent: false });
        }
      });
    this.shipperInformation.valueChanges
      .subscribe((val) => {
        const { phone } = val;
        if (phone && phone.length) {
          const formatPhone = this.phoneNumberPipe.transform(phone);
          this.shipperInformation
            .get('phone')
            .patchValue(formatPhone, { emitEvent: false });
        }
      });
  }

  private subscribeCarVin() {
    this.validatorVin$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe((vin: number) => {
        this.getCar(vin);
      });
  }

  private validateAddress() {
    this.validatorAddress$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe((form: string) => {
        this.checkAddress(form);
      });
  }

  public getCar(key: number) {
    this.carService.get(this.cars[key].vin).subscribe(
      (res) => {
        this.cars[key] = {
          ...res,
          year: res.year ? res.year.toString() : '',
          length: res.length ? res.length.toString() : '',
          height: res.length ? res.length.toString() : '',
          inop: this.cars[key].inop,
        };
        this.subscribeCarVin();
        this.loadingService.stopLoading();
      },
      () => {
        this.subscribeCarVin();
      },
    );
  }

  public isValid() {
    const valid = this.cars.find(
      item => !(item.make && item.model && item.type),
    );
    return !(!valid && this.cars.length);
  }

  public addCar() {
    this.cars = [
      ...this.cars,
      {
        make: '',
        model: '',
        type: '',
        year: '',
        vin: '',
        inop: false,
      },
    ];
  }

  public removeCar(key: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm Delete',
        description: 'Are you sure?',
        nameButton: 'Confirm',
        reason: false,
      },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.cars.splice(key, 1);
        }
      });
  }

  public changeByVin(key: number) {
    if (this.cars[key].vin.length > 13) {
      this.validatorVin$.next(key);
    }
  }

  public cancel() {
    this.router.navigate([APP_ROUTES.orders]);
  }

  public addressValidator(form: string) {
    this.validatorAddress$.next(form);
  }

  private checkAddress(form: string) {
    const { address, city, state, zipCode } = this[form].value;
    if (address && city && state && zipCode) {
      this.hereService
        .validateAddress({
          state,
          address,
          city,
          zipCode,
        })
        .subscribe(
          () => {
            this.setErrors(null, form);
            this.validateAddress();
          },
          () => {
            this.setErrors({ notEquivalent: true }, form);
            this.validateAddress();
          },
        );
    } else {
      this.validateAddress();
    }
  }

  private setErrors(err: ValidationErrors | null, form: string) {
    const { address, city, state, zipCode } = this[form].controls;
    address.setErrors(err);
    city.setErrors(err);
    state.setErrors(err);
    zipCode.setErrors(err);
  }

  private getCarTypes() {
    this.policyService.getList()
      .subscribe((res) => {
        this.vehicleTypes = [{ id: 0, type: undefined, price: 0 }, ...res.data];
      });
  }

  private getLocation(
    form: string,
  ): {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    addressType: string;
  } {
    const { address, city, state, zipCode, addressType } = this[form].value;
    return {
      address,
      city,
      state,
      zipCode,
      addressType: addressType ? addressType : undefined,
    };
  }

  private getPerson(
    form: string,
  ): {
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
  } {
    const { name, phone, email } = this[form].value;
    const splitName = name.split(' ');
    const firstName = splitName[0];
    const lastName = splitName[1] ? splitName[1] : '';
    // tslint:disable-next-line: object-shorthand-properties-first
    return { email, phoneNumber: phone, firstName, lastName };
  }

  private getShipper(): ShipperDTO {
    const {
      address,
      companyName,
      fullName,
      state,
      phone,
      zipCode,
      email,
      billingEmail,
      city,
    } = this.shipperInformation.value;
    return {
      address: address ? address : undefined,
      companyName: companyName ? companyName : undefined,
      city: city ? city : undefined,
      fullName: fullName ? fullName : undefined,
      state: state ? state : undefined,
      phone: phone ? phone : undefined,
      zipCode: zipCode ? zipCode : undefined,
      email: email ? email : undefined,
      billingEmail: billingEmail ? billingEmail : undefined,
    };
  }

  public save() {
    const pickInstructions: string = this.pickLocation.value.instructions;
    const deliveryInstructions: string = this.deliveryLocation.value
      .instructions;
    const trailerType: string = this.data.value.trailerType;
    const shipper = this.getShipper();
    let body: any = {
      trailerType,
      cars: this.cars,
      deliveryLocation: this.getLocation('deliveryLocation'),
      pickLocation: this.getLocation('pickLocation'),
      pickInstructions: pickInstructions ? pickInstructions : undefined,
      deliveryInstructions: deliveryInstructions
        ? deliveryInstructions
        : undefined,
      sender: this.getPerson('pickLocation'),
      receiver: this.getPerson('deliveryLocation'),
    };
    if (shipper && !!Object.keys(shipper).length) {
      body = { ...body, shipper };
    }
    this.loadingService.startLoading();
    this.orderService.createOrder(body)
      .subscribe(async (res) => {
        await this.router.navigate([APP_ROUTES.order, res.id]);
        this.loadingService.stopLoading();
      });
  }
}
