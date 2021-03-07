import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NgImageSliderComponent } from 'ng-image-slider';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { APP_ROUTES } from '../../app.constants';
import { CompanyInviteComponent } from '../../companies/company-invite/company-invite.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { NewAttachmentComponent } from '../../components/new-attachments/new-attachments.component';
import { NewNoteComponent } from '../../components/new-note/new-note.component';
import { PdfPreviewComponent } from '../../components/pdf-preview/pdf-preview.component';
import { SendEmailComponent } from '../../components/send-email/send-email.component';
import { REGEX_PHONE, INVITE_STATUS, SEND_BOL_STATUSES } from '../../constants';
import { LocationType, ORDER_STATUS, ROLES_STATUS, INSPECTION_TYPE } from '../../enums';
import {
  AccountDTO,
  CarDTO,
  InspectionDTO,
  InviteDTO,
  ORDER_SOURCE,
  OrderAttachmentDTO,
  OrderDTO,
  OrderNoteDTO,
  OrderTimelineDTO,
  SuccessDTO,
} from '../../interfaces/models';
import { PhoneNumberPipe } from '../../pipes/number-phone';
import { CarService } from '../../providers/car/car.service';
import { CompanyService } from '../../providers/company/company.service';
import { FileService } from '../../providers/file/file.service';
import { LoadingService } from '../../providers/loading/loading.service';
import { NotificationService } from '../../providers/notification/notification.service';
import { OrderService } from '../../providers/order/order.service';
import { UserService } from '../../providers/user/user.service';
import { RegisterService } from '../../providers/register/register.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  @ViewChild('document') document;
  id: string;
  notes: OrderNoteDTO[] = [];
  activities: OrderTimelineDTO[] = [];
  documents: OrderAttachmentDTO[] = [];
  currentUser: AccountDTO;
  order: OrderDTO;
  invite: InviteDTO;
  cars: CarDTO[] = [];
  locationType = LocationType;
  validatorVin$ = new Subject<number>();
  deleteCar: CarDTO[] = [];
  orderStatuses = ORDER_STATUS;
  selectPaymentMethod = false;
  paymentMethod: string;
  readonly = {
    pickup: true,
    delivery: true,
    shipper: true,
    payment: true,
    price: true,
    information: true,
  };
  methods = ['ACH', 'Cash', 'Check', 'ComCheck'];
  @ViewChild('nav') slider: NgImageSliderComponent;
  imageObject = [];
  imageObjectDelivery = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private orderService: OrderService,
    private fileService: FileService,
    private zone: NgZone,
    private userService: UserService,
    private companyService: CompanyService,
    private dialog: MatDialog,
    private phoneNumberPipe: PhoneNumberPipe,
    private notificationService: NotificationService,
    private carService: CarService,
    private registerService: RegisterService,
  ) {
  }

  public information = this.fb.group({
    orderId: new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]),
    orderUUID: new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]),
    status: new FormControl(''),
    dispatchInstructions: new FormControl(''),
    externalId: new FormControl(''),
  });

  public pickLocation = this.fb.group({
    state: new FormControl(''),
    city: new FormControl(''),
    zipCode: new FormControl(''),
    address: new FormControl(''),
    addressType: new FormControl(''),
    name: new FormControl(''),
    phone: new FormControl('', [Validators.pattern(REGEX_PHONE)]),
    email: new FormControl(''),
    instructions: new FormControl(''),
  });

  public deliveryLocation = this.fb.group({
    state: new FormControl(''),
    city: new FormControl(''),
    zipCode: new FormControl(''),
    address: new FormControl(''),
    addressType: new FormControl(''),
    name: new FormControl(''),
    phone: new FormControl('', [Validators.pattern(REGEX_PHONE)]),
    email: new FormControl(''),
    instructions: new FormControl(''),
  });

  public paymentInformation = this.fb.group({
    paymentMethods: new FormControl(''),
    salePrice: new FormControl(''),
    brokerFee: new FormControl(''),
    paymentNote: new FormControl(''),
    clientPaymentStatus: new FormControl(''),
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
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadingService.startLoading();
    this.currentUser = this.userService.user;
    if (this.currentUser && this.currentUser.roleId === ROLES_STATUS.SUPER_ADMIN) {
      this.getOrder();
      this.getNotesAdmin();
      this.getAttachmentsAdmin();
      this.getTimelinesAdmin();
    } else {
      this.getOrderCompany();
      this.getNotes();
      this.getAttachments();
      this.getTimelines();
    }
    this.onChangePhone();
  }

  public modeEdit(key: string) {
    this.readonly[key] = !this.readonly[key];
    return true;
  }

  public isCompanyUser() {
    return this.currentUser && this.currentUser.roleId &&
      [ROLES_STATUS.COMPANY_ADMIN, ROLES_STATUS.DISPATCHER].includes(this.currentUser.roleId);
  }

  public permissionWrite() {
    return (
      this.order &&
      this.order.source !== 'internal' &&
      this.isCompanyUser()
    );
  }

  public permissionWriteCars() {
    return (
      this.order &&
      this.order.source !== 'internal' &&
      this.isCompanyUser()
    ) || (this.currentUser && this.currentUser.roleId && ROLES_STATUS.SUPER_ADMIN === this.currentUser.roleId);
  }

  public canBeEdited() {
    if (!this.order) {
      return false;
    }

    if (this.isCompanyUser()) {
      return this.order.source !== 'internal';
    }

    return this.order.source === 'internal';
  }

  public permissionSendInvoice() {
    return (
      this.order && this.currentUser &&
      [
        ORDER_STATUS.CLAIMED.toString(),
        ORDER_STATUS.DELIVERED.toString(),
        ORDER_STATUS.BILLED.toString(),
      ].includes(this.order.status) &&
      [ROLES_STATUS.COMPANY_ADMIN, ROLES_STATUS.DISPATCHER, ROLES_STATUS.SUPER_ADMIN].includes(this.currentUser.roleId)
    );
  }

  public permissionSendBol() {
    return (
      this.order && this.currentUser &&
      (SEND_BOL_STATUSES.includes(this.order.status) || ORDER_STATUS.ON_DELIVERY === this.order.preStatus) &&
      [ROLES_STATUS.COMPANY_ADMIN, ROLES_STATUS.DISPATCHER, ROLES_STATUS.SUPER_ADMIN].includes(this.currentUser.roleId)
    );
  }

  public visiblePhotos() {
    return (
      this.order && this.currentUser &&
      ([...SEND_BOL_STATUSES, ORDER_STATUS.PAID.toString()].includes(this.order.status) || ORDER_STATUS.ON_DELIVERY === this.order.preStatus));
  }

  private onChangePhone() {
    this.pickLocation.valueChanges.subscribe((val) => {
      const { phone } = val;
      if (phone && phone.length) {
        const formatPhone = this.phoneNumberPipe.transform(phone);
        this.pickLocation
          .get('phone')
          .patchValue(formatPhone, { emitEvent: false });
      }
    });
    this.deliveryLocation.valueChanges.subscribe((val) => {
      const { phone } = val;
      if (phone && phone.length) {
        const formatPhone = this.phoneNumberPipe.transform(phone);
        this.deliveryLocation
          .get('phone')
          .patchValue(formatPhone, { emitEvent: false });
      }
    });
    this.shipperInformation.valueChanges.subscribe((val) => {
      const { phone } = val;
      if (phone && phone.length) {
        const formatPhone = this.phoneNumberPipe.transform(phone);
        this.shipperInformation
          .get('phone')
          .patchValue(formatPhone, { emitEvent: false });
      }
    });
    this.validatorVin$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe((vin: number) => {
        this.getCar(vin);
      });
  }

  public permissionPayment() {
    return (
      this.order && [ORDER_STATUS.PAID.toString()].includes(this.order.status)
    );
  }

  public permissionPaymentRead() {
    if (this.order && [ORDER_STATUS.PAID.toString()].includes(this.order.status)) {
      return true;
    }
    return this.readonly.payment;
  }

  public priceReadOnly() {
    if (this.order && ([ORDER_STATUS.PAID.toString()].includes(this.order.status) || this.order.source === 'internal')) {
      return true;
    }
    return this.readonly.price;
  }

  public permissionEdit() {
    return (
      this.order &&
      [
        ORDER_STATUS.DELIVERED.toString(),
        ORDER_STATUS.CLAIMED.toString(),
        ORDER_STATUS.PAID.toString(),
        ORDER_STATUS.BILLED.toString(),
      ].includes(this.order.status)
    );
  }

  private getOrder() {
    this.orderService.get(this.id).subscribe(
      (res) => {
        const invite = res && res.invite && res.invite.length && res.invite.find(item => INVITE_STATUS.PENDING === item.statusId);
        this.invite = !!invite ? invite : null;
        this.setOrderData(res);
      },
      () => {
        this.router.navigateByUrl(`${APP_ROUTES.order}/${APP_ROUTES.list}`);
      },
    );
  }

  private getOrderCompany() {
    this.companyService.getOrder(this.id).subscribe(
      (res) => {
        this.setOrderData(res);
      },
      () => {
        this.router.navigateByUrl(`${APP_ROUTES.order}/${APP_ROUTES.list}`);
      },
    );
  }

  private setOrderData(res: OrderDTO) {
    this.order = { ...this.order, ...res };
    this.cars = JSON.parse(JSON.stringify(res.cars));
    this.information.controls.orderId.setValue(res.id);
    this.information.controls.orderUUID.setValue(res.uuid);
    this.information.controls.status.setValue(
      this.orderService.formatStatus(res.status),
    );
    this.information.controls.dispatchInstructions.setValue(
      res.dispatchInstructions,
    );
    this.information.controls.externalId.setValue(
      res.externalId,
    );
    if (res && res.inspections && res.inspections.length) {
      this.setSlider(res.inspections);
    }
    this.setValue('pickLocation');
    this.setValue('deliveryLocation');
    this.setValuePayment();
    this.setValueShipper();
    this.loadingService.stopLoading();
  }

  public setSlider(inspections: InspectionDTO[]) {
    const pickInspection = inspections.find(inspection => inspection.type === INSPECTION_TYPE.PICKUP);
    const deliveryInspection = inspections.find(inspection => inspection.type === INSPECTION_TYPE.DELIVERY);
    let pickImages = [];

    if (pickInspection && pickInspection.images && pickInspection.images.length) {
      pickImages = pickInspection.images;
      this.imageObject = pickInspection.images.map(item => ({ image: item.signedUrl, thumbImage: item.thumbImage, alt: '', title: '' }));
    }

    if (deliveryInspection && deliveryInspection.images && deliveryInspection.images.length) {
      const deliveryImages = deliveryInspection.images.filter(item => !pickImages.find(image => image.url === item.url));
      this.imageObjectDelivery = deliveryImages.map(item => ({ image: item.signedUrl, thumbImage: item.thumbImage, alt: '', title: '' }));
    }
  }

  private setValuePayment() {
    const {
      paymentMethods,
      paymentNote,
      brokerFee,
      salePrice,
      clientPaymentStatus,
    } = this.order;
    this.paymentInformation.controls.paymentMethods.setValue(paymentMethods);
    this.paymentInformation.controls.paymentNote.setValue(paymentNote);
    this.paymentInformation.controls.brokerFee.setValue(brokerFee);
    this.paymentInformation.controls.salePrice.setValue(
      this.orderService.formatPrice(salePrice),
    );
    this.paymentInformation.controls.clientPaymentStatus.setValue(
      this.orderService.formatStatus(clientPaymentStatus),
    );
  }

  private setValueShipper() {
    if (this.order.shipper) {
      const {
        address,
        city,
        state,
        zipCode,
        companyName,
        fullName,
        phone,
        email,
        billingEmail,
      } = this.order.shipper;
      this.shipperInformation.controls.address.setValue(address);
      this.shipperInformation.controls.city.setValue(city);
      this.shipperInformation.controls.state.setValue(state);
      this.shipperInformation.controls.zipCode.setValue(zipCode);
      this.shipperInformation.controls.companyName.setValue(companyName);
      this.shipperInformation.controls.fullName.setValue(fullName);
      this.shipperInformation.controls.phone.setValue(phone);
      this.shipperInformation.controls.email.setValue(email);
      this.shipperInformation.controls.billingEmail.setValue(billingEmail);
    }
  }

  private setValue(form: string) {
    if (this.order[form]) {
      Object.keys(this.order[form]).forEach((key) => {
        if (this[form].controls[key] && this.order[form][key]) {
          this[form].controls[key].setValue(this.order[form][key]);
        }
      });
    }
    if (form === 'pickLocation') {
      if (this.order.sender) {
        this.pickLocation.controls.name.setValue(
          `${this.order.sender.firstName} ${this.order.sender.lastName}`,
        );
        this.pickLocation.controls.email.setValue(this.order.sender.email);
        this.pickLocation.controls.phone.setValue(
          this.order.sender.phoneNumber,
        );
        this.pickLocation.controls.instructions.setValue(
          this.order.pickInstructions,
        );
      }
    } else {
      if (this.order.receiver) {
        this.deliveryLocation.controls.name.setValue(
          `${this.order.receiver.firstName} ${this.order.receiver.lastName}`,
        );
        this.deliveryLocation.controls.email.setValue(
          this.order.receiver.email,
        );
        this.deliveryLocation.controls.phone.setValue(
          this.order.receiver.phoneNumber,
        );
        this.deliveryLocation.controls.instructions.setValue(
          this.order.deliveryInstructions,
        );
      }
    }
  }

  private getNotes() {
    this.orderService.getNotes(this.id)
      .subscribe((res) => {
        this.notes = res.data.map((note) => {
          return {
            ...note,
            createdDate: moment(note.createdAt).format('MM/DD/YYYY'),
          };
        });
      });
  }

  private getNotesAdmin() {
    this.orderService.getNotesAdmin(this.id)
      .subscribe((res) => {
        this.notes = res.data.map((note) => {
          return {
            ...note,
            createdDate: moment(note.createdAt).format('MM/DD/YYYY'),
          };
        });
      });
  }

  private getTimelinesAdmin() {
    this.orderService.getTimelineAdmin(this.id)
      .subscribe((res) => {
        this.prepareTimeines(res.data);
      });
  }

  private prepareTimeines(data: OrderTimelineDTO[]) {
    this.activities = data.map((activity) => {
      return {
        ...activity,
        createdDate: moment(activity.createdAt).format('MM/DD/YYYY HH:mm'),
      };
    });
  }

  private getTimelines() {
    this.orderService.getTimeline(this.id)
      .subscribe((res) => {
        this.prepareTimeines(res.data);
      });
  }

  public addNote() {
    const dialogRef = this.dialog.open(NewNoteComponent, {
      data: {
        id: parseInt(this.id, 10),
      },
      width: '450px',
    });
    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.notes = [
            {
              ...result,
              createdDate: moment(result.createdAt).format('MM/DD/YYYY'),
            },
            ...this.notes,
          ];
        }
      });
  }

  private getNameFile(name: string) {
    const extension = name.split('.').pop();
    return name.replace(`.${extension}`, '');
  }

  public uploadDocument(file: File) {
    if (!file) {
      return;
    }
    const dialogRef = this.dialog.open(NewAttachmentComponent, {
      width: '450px',
      data: {
        name: '',
      },
    });
    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loadingService.startLoading();
          this.document.nativeElement.value = null;
          this.fileService.upload(file)
            .subscribe(
              (res) => {
                let fileName = this.getNameFile(file.name);
                fileName = fileName ? fileName : this.getNameFile(res.url);
                this.orderService
                  .postAttachment({
                    orderId: parseInt(this.id, 10),
                    path: res.url,
                    displayName: result || fileName,
                  })
                  .subscribe(
                    (resp) => {
                      this.documents = [resp, ...this.documents];
                      this.loadingService.stopLoading();
                      this.notificationService.success('Attachment success added!');
                    },
                    () => {
                      this.loadingService.stopLoading();
                    },
                  );
              },
              () => {
                this.loadingService.stopLoading();
              });
        }
      });
  }

  private getAttachments() {
    this.orderService.getAttachments(this.id)
      .subscribe((res) => {
        this.documents = res.data;
      });
  }

  private getAttachmentsAdmin() {
    this.orderService.getAttachmentsAdmin(this.id)
      .subscribe((res) => {
        this.documents = res.data;
      });
  }

  public viewDocument(doc: OrderAttachmentDTO) {
    window.open(doc.url, '_blank');
  }

  public checkRemove(attachment: OrderAttachmentDTO) {
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
          this.loadingService.startLoading();
          this.removeDocument(attachment);
        }
      });
  }

  private removeDocument(attachment: OrderAttachmentDTO) {
    this.orderService
      .deleteAttachment(attachment.orderId, attachment.id)
      .subscribe(() => {
        this.zone.run(() => {
          this.documents = this.documents.filter(
            document => document.id !== attachment.id,
          );
        });
        this.loadingService.stopLoading();
        this.notificationService.success('Attachment success deleted!');
      });
  }

  public isCarrier() {
    return this.currentUser && this.currentUser.roleId && this.currentUser.roleId === ROLES_STATUS.COMPANY_ADMIN;
  }

  public openSelectPaid() {
    if (this.isCarrier()) {
      this.selectPaymentMethod = true;
    } else {
      this.checkPaid();
    }
  }

  public checkPaid() {
    this.selectPaymentMethod = false;
    const description = this.isCarrier() ? `Are you sure, mark as paid with ${this.paymentMethod} method?` : 'Are you sure?';
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        description,
        action: 'Confirm mark as paid',
        nameButton: 'Confirm',
        reason: false,
      },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loadingService.startLoading();
          this.markAsPaid();
        }
      });
  }

  private markAsPaid() {
    this.loadingService.startLoading();

    (this.isCompanyUser()
      ? this.orderService.markPaidOrder(this.id, this.paymentMethod)
      : this.orderService.markAsPaid(this.id, this.paymentMethod)
    ).subscribe(() => {
      this.order = { ...this.order, status: ORDER_STATUS.PAID, paymentMethods: this.paymentMethod };
      this.paymentInformation.controls.paymentMethods.setValue(this.paymentMethod);
      this.paymentMethod = null;
      this.loadingService.stopLoading();
      this.notificationService.success('Order mark as paid!');
    });
  }

  public checkInvoice() {
    const dialogRef = this.dialog.open(SendEmailComponent, {
      width: '450px',
      data: {
        textHeader: 'Confirm send invoice',
        textButton: 'Send',
        checkDate: true,
        dueDate: this.order.invoiceDueDate,
      },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loadingService.startLoading();
          this.sendInvoice(result);
        }
      });
  }

  public sendInvoice(body: { email: string; dueDate?: Date }) {
    this.orderService.sendInvoice(this.id, body).subscribe(() => {
      this.loadingService.stopLoading();
      this.order = { ...this.order, status: ORDER_STATUS.BILLED };
      this.notificationService.success('Success sent!');
    });
  }

  public previewBOL() {
    this.loadingService.startLoading();
    this.orderService.getBOLLink(this.id).subscribe((rs: SuccessDTO) => {
      this.loadingService.stopLoading();
      const dialogRef = this.dialog.open(PdfPreviewComponent, {
        width: '450vw',
        data: {
          textHeader: `BOL for order ${this.order.uuid}`,
          link: rs.message,
          textButton: 'Send to email',
        },
      });

      dialogRef.afterClosed()
        .subscribe((result) => {
          if (result) {
            this.checkBol();
          }
        });
    });
  }

  public previewInvoice() {
    this.loadingService.startLoading();
    this.orderService.getInvoiceLink(this.id).subscribe((rs: SuccessDTO) => {
      this.loadingService.stopLoading();
      const dialogRef = this.dialog.open(PdfPreviewComponent, {
        width: '450vw',
        data: {
          textHeader: `Invoice for order ${this.order.uuid}`,
          link: rs.message,
          textButton: 'Send to email',
        },
      });

      dialogRef.afterClosed()
        .subscribe((result) => {
          if (result) {
            this.checkInvoice();
          }
        });
    });
  }

  public checkBol() {
    const dialogRef = this.dialog.open(SendEmailComponent, {
      width: '450px',
      data: {
        textHeader: 'Confirm send bol',
        textButton: 'Send',
        checkDate: false,
      },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result && result.email) {
          this.loadingService.startLoading();
          this.loadingService.startLoading();
          this.orderService.sendBOL(parseInt(this.id, 10), { email: result.email }).subscribe(() => {
            this.loadingService.stopLoading();
            this.notificationService.success('Sent successfully!');
          });
        }
      });
  }

  public checkArchive() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm Archive',
        description: 'Are you sure?',
        nameButton: 'Confirm',
        reason: false,
      },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.archive();
        }
      });
  }

  private archive() {
    this.loadingService.startLoading();
    (this.isCompanyUser()
      ? this.orderService.actionOrder(this.id, 'archive')
      : this.orderService.action(this.id, 'archive')
    ).subscribe(() => {
      this.loadingService.stopLoading();
      this.isCompanyUser()
        ? this.router.navigate([APP_ROUTES.orders])
        : this.router.navigate([APP_ROUTES.sys_order]);
      this.notificationService.success('Archive successfully!');
    });
  }

  public save() {
    const data = {
      cars: this.cars.filter(car => !this.isValid(car)),
      pickLocation: this.getLocation('pickLocation'),
      deliveryLocation: this.getLocation('deliveryLocation'),
      salePrice: null,
    };

    if (this.order.source !== ORDER_SOURCE.INTERNAL) {
      data.salePrice = parseInt(this.paymentInformation.get('salePrice').value, 10);
      this.saveOrder(data, null);
    } else {
      this.calculatePrice(data);
    }

    this.readonly = {
      pickup: true,
      delivery: true,
      shipper: true,
      payment: true,
      price: true,
      information: true,
    };
  }

  private getLocation(keyForm: string) {
    return {
      address: this[keyForm].get('address').value,
      city: this[keyForm].get('city').value,
      state: this[keyForm].get('state').value,
      zipCode: this[keyForm].get('zipCode').value,
      addressType: this[keyForm].get('addressType').value,
    };
  }

  private calculatePrice(data: any) {
    this.loadingService.startLoading();
    this.orderService
      .calculatePrice({
        ...data,
        trailerType: this.order.trailerType,
        orderId: this.order.id,
      })
      .subscribe((res) => {
        this.loadingService.stopLoading();
        if (this.order.priceWithDiscount !== res.price) {
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '450px',
            data: {
              action: 'Confirm Edit',
              description: `New order price ${this.orderService.formatPrice(res.price)}$`,
              nameButton: 'Ok',
              reason: false,
            },
          });

          dialogRef.afterClosed()
            .subscribe((result) => {
              if (result) {
                this.loadingService.startLoading();
                this.saveOrder(data, res.hash);
              } else {
                if (this.deleteCar.length) {
                  this.cars = [...this.cars, ...this.deleteCar];
                }
              }
              this.deleteCar = [];
            });
        } else {
          this.saveOrder(data, res.hash);
        }
      });
  }

  public saveToAdmin() {
    if (this.currentUser && this.order.cars.length !== this.cars.length &&
      ROLES_STATUS.SUPER_ADMIN === this.currentUser.roleId) {
      this.checkSaveAdmin();
    } else if (this.permissionWrite()) {
      this.save();
    } else {
      this.saveAdmin();
      this.readonly = {
        pickup: true,
        delivery: true,
        shipper: true,
        payment: true,
        price: true,
        information: true,
      };
    }
  }

  private checkSaveAdmin() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm Save',
        description: 'You want to recalculate the price?',
        nameButton: 'Yes',
        cancelButton: 'No',
        reason: false,
      },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.save();
        } else {
          this.saveAdmin(true);
        }
      });
  }

  private saveAdmin(recalculate = false) {
    this.loadingService.startLoading();
    const body = {
      cars: this.cars.filter(car => !this.isValid(car)),
      paymentMethods: this.paymentInformation.get('paymentMethods').value,
      salePrice: parseFloat(this.paymentInformation.get('salePrice').value),
      brokerFee: parseInt(this.paymentInformation.get('brokerFee').value, 10),
      paymentNote: this.paymentInformation.get('paymentNote').value,
      shipper: {
        ...this.order.shipper,
        address: this.shipperInformation.get('address').value,
        companyName: this.shipperInformation.get('companyName').value,
        city: this.shipperInformation.get('city').value,
        fullName: this.shipperInformation.get('fullName').value,
        state: this.shipperInformation.get('state').value,
        phone: this.shipperInformation.get('phone').value,
        zipCode: this.shipperInformation.get('zipCode').value,
        email: this.shipperInformation.get('email').value,
        billingEmail: this.shipperInformation.get('billingEmail').value,
      },
    };

    this.orderService.patchAdmin(this.order.id, body, recalculate)
      .subscribe((res) => {
        this.setOrderData({ ...body, ...res });
        this.loadingService.stopLoading();
        this.notificationService.success('Edited successfully!');
      });
  }

  private saveOrder(data: any, hash: string) {
    const senderName = this.pickLocation.get('name').value.split(' ');
    const receiverName = this.deliveryLocation.get('name').value.split(' ');
    const body = {
      hash,
      ...data,
      pickInstructions: this.pickLocation.get('instructions').value,
      sender: {
        ...this.order.sender,
        email: this.pickLocation.get('email').value,
        phoneNumber: this.pickLocation.get('phone').value,
        firstName: senderName[0] ? senderName[0] : '',
        lastName: senderName[1] ? senderName[1] : '',
      },
      deliveryInstructions: this.deliveryLocation.get('instructions').value,
      receiver: {
        ...this.order.receiver,
        email: this.deliveryLocation.get('email').value,
        phoneNumber: this.deliveryLocation.get('phone').value,
        firstName: receiverName[0] ? receiverName[0] : '',
        lastName: receiverName[1] ? receiverName[1] : '',
      },
      paymentMethods: this.paymentInformation.get('paymentMethods').value,
      brokerFee: parseInt(this.paymentInformation.get('brokerFee').value, 10),
      paymentNote: this.paymentInformation.get('paymentNote').value,
      shipper: {
        ...this.order.shipper,
        address: this.shipperInformation.get('address').value,
        companyName: this.shipperInformation.get('companyName').value,
        city: this.shipperInformation.get('city').value,
        fullName: this.shipperInformation.get('fullName').value,
        state: this.shipperInformation.get('state').value,
        phone: this.shipperInformation.get('phone').value,
        zipCode: this.shipperInformation.get('zipCode').value,
        email: this.shipperInformation.get('email').value,
        billingEmail: this.shipperInformation.get('billingEmail').value,
      },
      externalId: this.information.get('externalId').value,
    };

    this.orderService.patch(this.order.id, body)
      .subscribe((res) => {
        delete body.hash;
        this.setOrderData({ ...body, ...res });
        this.notificationService.success('Edited successfully!');
      });
  }

  public isValid(car: CarDTO) {
    return !(car.make && car.model && car.type && car.year);
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
        orderId: this.order.id,
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
          this.deleteCar = this.cars.splice(key, 1);
          this.saveToAdmin();
        }
      });
  }

  public changeByVin(key: number) {
    if (this.cars[key].vin.length > 13) {
      this.validatorVin$.next(key);
    }
  }

  public getCar(key: number) {
    this.carService.get(this.cars[key].vin)
      .subscribe((res) => {
        this.cars[key] = {
          ...res,
          year: res.year ? res.year.toString() : '',
          length: res.length ? res.length.toString() : '',
          height: res.length ? res.length.toString() : '',
          inop: false,
        };
      });
  }

  public checkReceipt() {
    const dialogRef = this.dialog.open(SendEmailComponent, {
      width: '450px',
      data: {
        textHeader: 'Confirm send receipt',
        textButton: 'Send',
        checkDate: false,
      },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result && result.email) {
          this.loadingService.startLoading();
          this.orderService
            .sendReceipt(this.id, { email: result.email })
            .subscribe(() => {
              this.loadingService.stopLoading();
              this.notificationService.success('Sent successfully!');
            });
        }
      });
  }

  public previewReceipt() {
    this.loadingService.startLoading();
    this.orderService.getReceiptLink(this.id)
      .subscribe((rs: SuccessDTO) => {
        this.loadingService.stopLoading();
        const dialogRef = this.dialog.open(PdfPreviewComponent, {
          width: '450vw',
          data: {
            textHeader: `Receipt for order ${this.order.uuid}`,
            link: rs.message,
            textButton: 'Send to email',
          },
        });

        dialogRef.afterClosed()
          .subscribe((result) => {
            if (result) {
              this.checkInvoice();
            }
          });
      });
  }

  public isSuperAdmin() {
    return this.currentUser && this.currentUser.roleId === ROLES_STATUS.SUPER_ADMIN;
  }

  public isRetrieveDispatch() {
    return this.currentUser && this.currentUser.roleId === ROLES_STATUS.SUPER_ADMIN && this.order && this.invite;
  }

  public isDispatchSheet() {
    return this.currentUser && this.currentUser.roleId === ROLES_STATUS.SUPER_ADMIN && this.order &&
      this.order.status === ORDER_STATUS.PUBLISHED && this.order.published && !this.order.companyId && !this.invite;
  }

  public sendRetrieveDispatch() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm Retrieve Dispatch',
        description: `Are you sure? Retrieve Dispatch from Carrier ${this.invite && this.invite.company && this.invite.company.name}`,
        nameButton: 'Yes',
        reason: false,
      },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loadingService.startLoading();
          this.registerService.retrieveDispatch(this.invite.id)
            .subscribe(
              () => {
                this.loadingService.stopLoading();
                this.invite = null;
              });
        }
      });
  }

  public sendDispatchSheet() {
    const ref = this.dialog.open(CompanyInviteComponent, { width: '450px', data: { orderId: this.order.id } });
    ref.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.invite = result;
        }
      });
  }

}
