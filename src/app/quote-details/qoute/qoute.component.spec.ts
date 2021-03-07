import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { HereService } from '../../providers/here/here.service';
import { LoadingService } from '../../providers/loading/loading.service';
import { OrderService } from '../../providers/order/order.service';
import { UserService } from '../../providers/user/user.service';
import { QouteComponent } from './qoute.component';

describe('QouteComponent', () => {
  let component: QouteComponent;
  let fixture: ComponentFixture<QouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QouteComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        LeafletModule,
        MatDialogModule,
      ],
      providers: [
        HttpClientTestingModule,
        OrderService,
        HereService,
        LoadingService,
        UserService,
        { provide: MatDialogRef, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
