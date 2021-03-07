import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import * as countrycitystatejson from 'countrycitystatejson';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { CITIES, CONDITION, STATES, TRAILER_TYPE } from '../../constants';
import { ORDER_TABS } from '../../enums';
import { PolicyDTO } from '../../interfaces/models';
import { PolicyService } from '../../providers/policy/policy.service';

interface LoactionEvent {
  value: string;
  key: string;
}

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
  public selectedTab = 0;
  public filterSubject: Subject<any> = new Subject<any>();
  public plannerSubject: Subject<any> = new Subject<any>();
  vehicleTypes: PolicyDTO[] = [];
  counts = {
    available: 0,
    requested: 0,
    bids: 0,
  };
  trailerTypes = TRAILER_TYPE;
  conditions = CONDITION;
  orderTabs = ORDER_TABS;
  locations: any[];
  location$ = new Subject<LoactionEvent>();
  filterLocation = {
    origin: null,
    destination: null,
  };
  planner = false;

  constructor(
    private fb: FormBuilder,
    private policyService: PolicyService,
  ) {
  }

  public filter = this.fb.group({
    origin: new FormControl(''),
    originRadius: new FormControl(''),
    destination: new FormControl(''),
    destinationRadius: new FormControl(''),
    trailerType: new FormControl(''),
    carType: new FormControl(''),
    minimumNumberOfVehiclesPerLoad: new FormControl(''),
    condition: new FormControl(''),
  });

  ngOnInit() {
    this.getPolicy();
    this.subscribeEvents();
  }

  private subscribeEvents() {
    this.location$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe((data: LoactionEvent) => {
      this.getGeocode(data.value.trim().toLowerCase());
    });
  }

  private getPolicy() {
    this.policyService.getList()
      .subscribe((res) => {
        this.vehicleTypes = [{ id: 0, type: undefined, price: 0 }, ...res.data];
      });
  }

  private getValue(key: string) {
    return this.filter.get(key).value;
  }

  private setValue(key: string, value: string) {
    this.filter.controls[key].setValue(value);
  }

  private validateLocation(location: string) {
    const matches = location.match(/\b[^\d\s]+\b/g);
    return matches && matches.length >= 2;
  }

  private getState(name: string) {
    const nameState = name.toUpperCase().trim();
    const states = STATES.filter(item => item.name.toUpperCase() === nameState || item.abbreviation.toUpperCase() === nameState);
    const [state] = states;
    return state;
  }

  private getCityAndState(location: string) {
    const [presumedCity, presumedState] = location.match(/\b[^\d\s]+\b/g);
    let isState = this.getState(presumedState);
    if (isState) {
      return {
        city: presumedCity,
        state: presumedState,
      };
    }

    isState = this.getState(presumedCity);
    if (isState) {
      return {
        city: presumedState,
        state: presumedCity,
      };
    }
    return null;
  }

  private getLocations(key: string) {
    const location = this.getValue(key);

    if (this.validateLocation(location) && this.filterLocation[key]) {
      return JSON.stringify({
        city: this.filterLocation[key].city,
        state: this.filterLocation[key].state,
        radius: this.getValue(`${key}Radius`) ? this.getValue(`${key}Radius`) : 100,
      });
    }

    if (this.validateLocation(location)) {
      const resp = this.getCityAndState(location);
      if (resp) {
        return JSON.stringify({
          city: resp.city,
          state: resp.state,
          radius: this.getValue(`${key}Radius`) ? this.getValue(`${key}Radius`) : 100,
        });
      }
      return '';
    }

    const state = this.getState(location);
    if (state) {
      const city = countrycitystatejson.getCountryByShort(state.abbreviation);
      return JSON.stringify({
        city: city.capital,
        state: state.name,
        radius: this.getValue(`${key}Radius`) ? this.getValue(`${key}Radius`) : 100,
      });
    }

    return '';
  }

  public search() {
    const filter = {
      origin: this.getLocations('origin'),
      destination: this.getLocations('destination'),
      trailerType: this.getValue('trailerType'),
      minimumNumberOfVehiclesPerLoad: this.getValue('minimumNumberOfVehiclesPerLoad'),
      condition: this.getValue('condition'),
      carType: this.getValue('carType'),
    };
    this.filterSubject.next(filter);
  }

  private getGeocode(search: string) {
    if (search && search.length) {
      let state = search.toUpperCase().trim();
      let city = search.toUpperCase().trim();
      if (this.validateLocation(search)) {
        const resp = this.getCityAndState(search);
        if (resp) {
          state = resp.state.toUpperCase().trim();
          city = resp.city.toUpperCase().trim();
          this.locations = CITIES.filter(item =>
            item.city.toUpperCase().includes(city) ||
            item.city.toUpperCase() === city &&
            item.state.toUpperCase().includes(state)).slice(0, 20);
          return;
        }
      }
      this.locations = CITIES.filter(item =>
        item.city.toUpperCase().includes(city) ||
        item.city.toUpperCase() === city ||
        item.state.toUpperCase().includes(state) ||
        item.state.toUpperCase() === state).slice(0, 20);
    } else {
      this.locations = [];
    }
  }

  public setFilter(key: string) {
    const location = this.getValue(key);
    this.setValue(key, `${location.city} ${location.state}`);
    this.filterLocation[key] = { state: location.state, city: location.city };
  }

  public changeCount(count: number, key: string) {
    this.counts[key] = count;
  }

  public changeOpenPlanner(planner: boolean) {
    this.planner = planner;
  }

  public openPlanner() {
    this.plannerSubject.next(true);
  }
}
