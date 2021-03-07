import { DragDropModule } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, Inject, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ErrorStateMatcher,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ApmService } from '@elastic/apm-rum-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgImageSliderModule } from 'ng-image-slider';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { environment } from '../environments/environment';
import { AccountInviteComponent } from './accounts/account-invite/account-invite.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CompanyInviteComponent } from './companies/company-invite/company-invite.component';
import { AddTripComponent } from './components/add-trip/add-trip.component';
import { AssignToTripComponent } from './components/assign-trip/assign-trip.component';
import { AuthComponent } from './components/auth/auth.component';
import { ChooseDispatcherComponent } from './components/choose-dispatcher/choose-dispatcher.component';
import { MyCompanyComponent } from './components/company/company.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { CreateTripComponent } from './components/create-trip/create-trip.component';
import { DeclineInviteComponent } from './components/decline-invite/decline-invite.component';
import { DispatchComponent } from './components/dispatch/dispatch.component';
import { JoinDriverComponent } from './components/drivers/drivers.component';
import { EditCarComponent } from './components/edit-car/edit-car.component';
import { ErrorComponent } from './components/error/error.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HeaderComponent } from './components/header/header.component';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { LoginComponent } from './components/login/login.component';
import { NewAttachmentComponent } from './components/new-attachments/new-attachments.component';
import { NewNoteComponent } from './components/new-note/new-note.component';
import { NewDiscountComponent } from './components/new-price/new-price.component';
import { PdfPreviewComponent } from './components/pdf-preview/pdf-preview.component';
import { PolicyComponent } from './components/policy/policy.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChangesCarrierInviteComponent } from './components/register-carrier-changes/changes-carrier-invite.component';
import { RegisterCarrierFinishComponent } from './components/register-carrier-finish/register-carrier-finish.component';
import { RegisterCarrierInviteComponent } from './components/register-carrier-invite/register-carrier-invite.component';
import { RegisterCarrierComponent } from './components/register-carrier/register-carrier.component';
import { RegisterCommonComponent } from './components/register-common/register-common.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SendEmailComponent } from './components/send-email/send-email.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TripPlannerComponent } from './components/trip-planner/trip-planner.component';
import { ViewNoteComponent } from './components/view-note/view-note.component';
import { WaitingComponent } from './components/waiting/waiting.component';
import { DirectivesModule } from './directives.module';
import { PhoneNumberPipe } from './pipes/number-phone';
import { AuthService } from './providers/auth/auth.service';
import { CarService } from './providers/car/car.service';
import { CompanyService } from './providers/company/company.service';
import { DispatchService } from './providers/dispatch/dispatch.service';
import { ErrorService } from './providers/error/error.service';
import { FileService } from './providers/file/file.service';
import { GeneralService } from './providers/general/general.service';
import { HereService } from './providers/here/here.service';
import { InterceptorService } from './providers/interceptor/interceptor.service';
import { JoinRequestsService } from './providers/joinRequests/joinRequests.service';
import { LoadingService } from './providers/loading/loading.service';
import { AppErrorhandler } from './providers/myErrorHandler/myErrorHandler.service';
import { NotificationService } from './providers/notification/notification.service';
import { OrderService } from './providers/order/order.service';
import { PolicyService } from './providers/policy/policy.service';
import { RegisterService } from './providers/register/register.service';
import { ReportsService } from './providers/reports/reports.service';
import { UserService } from './providers/user/user.service';
import { TermsComponent } from './components/terms/terms.component';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
];
const config: SocketIoConfig = {
  url: environment.socket_api, options: {
    reconnect: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
    autoConnect: true,
    forceNew: true,
    reconnection: true,
  },
};

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoginComponent,
    ForgotPasswordComponent,
    TermsComponent,
    RegisterCommonComponent,
    RegisterCarrierComponent,
    RegisterCarrierFinishComponent,
    ResetPasswordComponent,
    LoadingScreenComponent,
    ErrorComponent,
    RegisterCarrierInviteComponent,
    ChangesCarrierInviteComponent,
    ConfirmDialogComponent,
    SendEmailComponent,
    SidebarComponent,
    MyCompanyComponent,
    HeaderComponent,
    ProfileComponent,
    AccountInviteComponent,
    WaitingComponent,
    CompanyInviteComponent,
    PolicyComponent,
    NewDiscountComponent,
    NewNoteComponent,
    NewAttachmentComponent,
    JoinDriverComponent,
    DispatchComponent,
    ChooseDispatcherComponent,
    DeclineInviteComponent,
    CreateTripComponent,
    AddTripComponent,
    AssignToTripComponent,
    TripPlannerComponent,
    ViewNoteComponent,
    EditCarComponent,
    PhoneNumberPipe,
    PdfPreviewComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    DirectivesModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatMenuModule,
    NgSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatSlideToggleModule,
    DragDropModule,
    LeafletModule.forRoot(),
    RecaptchaV3Module,
    SocketIoModule.forRoot(config),
    NgxExtendedPdfViewerModule,
    NgImageSliderModule,
  ],
  providers: [
    RegisterService,
    AuthService,
    UserService,
    LoadingService,
    NotificationService,
    ErrorService,
    FileService,
    CompanyService,
    OrderService,
    HereService,
    PolicyService,
    CarService,
    GeneralService,
    DispatchService,
    ReportsService,
    JoinRequestsService,
    DatePipe,
    HttpClientModule,
    PhoneNumberPipe,
    httpInterceptorProviders,
    {
      provide: ErrorStateMatcher,
      useClass: ShowOnDirtyErrorStateMatcher,
    },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'left',
      },
    },
    { provide: ErrorHandler, useClass: AppErrorhandler },
    {
      provide: ApmService,
      useClass: ApmService,
      deps: [Router],
    },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recatchaSiteKey },
  ],
  entryComponents: [
    ConfirmDialogComponent,
    SendEmailComponent,
    AccountInviteComponent,
    CompanyInviteComponent,
    PolicyComponent,
    NewDiscountComponent,
    NewNoteComponent,
    NewAttachmentComponent,
    JoinDriverComponent,
    ChooseDispatcherComponent,
    DispatchComponent,
    CreateTripComponent,
    AddTripComponent,
    AssignToTripComponent,
    TripPlannerComponent,
    ViewNoteComponent,
    EditCarComponent,
    PdfPreviewComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(@Inject(ApmService) service: ApmService) {
    // API is exposed through this apm instance
    const apm = service.init({
      serviceName: 'cabinet',
      serverUrl: environment.apmServiceURL,
    });

    apm.setUserContext({
      username: 'anonymous',
    });
  }
}
