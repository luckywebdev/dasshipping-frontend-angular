import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { APP_ROUTES } from './app.constants';
import { AuthComponent } from './components/auth/auth.component';
import { MyCompanyComponent } from './components/company/company.component';
import { DeclineInviteComponent } from './components/decline-invite/decline-invite.component';
import { ErrorComponent } from './components/error/error.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChangesCarrierInviteComponent } from './components/register-carrier-changes/changes-carrier-invite.component';
import { RegisterCarrierFinishComponent } from './components/register-carrier-finish/register-carrier-finish.component';
import { RegisterCarrierInviteComponent } from './components/register-carrier-invite/register-carrier-invite.component';
import { RegisterCarrierComponent } from './components/register-carrier/register-carrier.component';
import { RegisterCommonComponent } from './components/register-common/register-common.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { WaitingComponent } from './components/waiting/waiting.component';
import { ROLES_ENUM } from './enums';
import { UserService } from './providers/user/user.service';
import { TermsComponent } from './components/terms/terms.component';

const routes: Routes = [
  { path: '', redirectTo: `/${APP_ROUTES.orders}/${APP_ROUTES.list}`, pathMatch: 'full' },
  { path: APP_ROUTES.auth, component: AuthComponent },
  { path: APP_ROUTES.forgot_password, component: ForgotPasswordComponent },
  { path: APP_ROUTES.terms, component: TermsComponent },
  {
    path: `${APP_ROUTES.register_carrier_finish}/:hash`,
    component: RegisterCarrierFinishComponent,
  },
  {
    path: `${APP_ROUTES.reset_password}/:hash`,
    component: ResetPasswordComponent,
  },
  {
    path: `${APP_ROUTES.reset_password}`,
    component: ResetPasswordComponent,
    canActivate: [UserService],
    data: { roles: [ROLES_ENUM.SUPER_ADMIN, ROLES_ENUM.COMPANY_ADMIN, ROLES_ENUM.DISPATCHER] },
  },
  { path: APP_ROUTES.register, component: RegisterCarrierComponent },
  {
    path: `${APP_ROUTES.register_common}/:hash`,
    component: RegisterCommonComponent,
  },
  {
    path: `${APP_ROUTES.register_carrier}/:hash`,
    component: RegisterCarrierInviteComponent,
  },
  {
    path: `${APP_ROUTES.changes_carrier}/:hash`,
    component: ChangesCarrierInviteComponent,
  },
  {
    path: `${APP_ROUTES.common_decline}/:hash`,
    component: DeclineInviteComponent,
  },
  {
    path: `${APP_ROUTES.carrier_decline}/:hash`,
    component: DeclineInviteComponent,
  },
  { path: `${APP_ROUTES.waiting}/:messageId`, component: WaitingComponent },
  {
    path: `${APP_ROUTES.profile}`,
    component: ProfileComponent,
    canActivate: [UserService],
    data: { roles: [ROLES_ENUM.SUPER_ADMIN] },
  },
  { path: APP_ROUTES.error, component: ErrorComponent },
  {
    path: APP_ROUTES.my_company,
    component: MyCompanyComponent,
    canActivate: [UserService],
    data: { roles: [ROLES_ENUM.COMPANY_ADMIN, ROLES_ENUM.DISPATCHER] },
  },
  {
    path: APP_ROUTES.drivers_location,
    loadChildren:
      './drivers-location/drivers-location.module#DriversLocationModule',
    canActivate: [UserService],
    data: { roles: [ROLES_ENUM.COMPANY_ADMIN, ROLES_ENUM.DISPATCHER] },
  },
  {
    path: `${APP_ROUTES.drivers_location}/:driverID`,
    loadChildren:
      './drivers-location/drivers-location.module#DriversLocationModule',
    canActivate: [UserService],
    data: { roles: [ROLES_ENUM.COMPANY_ADMIN, ROLES_ENUM.DISPATCHER] },
  },
  {
    path: APP_ROUTES.accounts,
    loadChildren: './accounts/accounts.module#AccountsModule',
    canActivate: [UserService],
    data: { roles: [ROLES_ENUM.SUPER_ADMIN, ROLES_ENUM.COMPANY_ADMIN, ROLES_ENUM.DISPATCHER] },
  },
  {
    path: APP_ROUTES.company,
    loadChildren: './companies/companies.module#CompaniesModule',
    canActivate: [UserService],
    data: { roles: [ROLES_ENUM.SUPER_ADMIN] },
  },
  {
    path: APP_ROUTES.order,
    loadChildren: './order/order.module#OrderModule',
    canActivate: [UserService],
    data: { roles: [ROLES_ENUM.COMPANY_ADMIN, ROLES_ENUM.DISPATCHER] },
  },
  {
    path: APP_ROUTES.orders,
    loadChildren: './orders/orders.module#OrdersModule',
    canActivate: [UserService],
    data: { roles: [ROLES_ENUM.COMPANY_ADMIN, ROLES_ENUM.DISPATCHER] },
  },
  {
    path: APP_ROUTES.new_order,
    loadChildren: './new-order/new-order.module#NewOrderModule',
    canActivate: [UserService],
    data: { roles: [ROLES_ENUM.COMPANY_ADMIN, ROLES_ENUM.DISPATCHER] },
  },
  {
    path: APP_ROUTES.sys_order,
    loadChildren: './sys-orders/sys-orders.module#SysOrdersModule',
    canActivate: [UserService],
    data: { roles: [ROLES_ENUM.SUPER_ADMIN] },
  },
  {
    path: `${APP_ROUTES.order}/:id`,
    loadChildren: './order-details/order-details.module#OrderDetailsModule',
    canActivate: [UserService],
    data: { roles: [ROLES_ENUM.SUPER_ADMIN, ROLES_ENUM.COMPANY_ADMIN, ROLES_ENUM.DISPATCHER] },
  },
  {
    path: APP_ROUTES.trip,
    loadChildren: './trip/trip.module#TripModule',
    canActivate: [UserService],
    data: { roles: [ROLES_ENUM.COMPANY_ADMIN, ROLES_ENUM.DISPATCHER] },
  },
  {
    path: `${APP_ROUTES.dispatch}/:id`,
    loadChildren: './dispatch/dispatch.module#DispatchModule',
    canActivate: [UserService],
    data: { roles: [ROLES_ENUM.SUPER_ADMIN] },
  },
  {
    path: APP_ROUTES.quote,
    loadChildren: './quote/quote.module#QuoteModule',
    canActivate: [UserService],
    data: { roles: [ROLES_ENUM.SUPER_ADMIN] },
  },
  {
    path: APP_ROUTES.leeds,
    loadChildren: './leads/lead.module#LeadModule',
    canActivate: [UserService],
    data: { roles: [ROLES_ENUM.SUPER_ADMIN] },
  },
  {
    path: `${APP_ROUTES.quote}/:id`,
    loadChildren: './quote-details/quote-details.module#QuoteDetailsModule',
    canActivate: [UserService],
    data: { roles: [ROLES_ENUM.SUPER_ADMIN] },
  },
  {
    path: APP_ROUTES.policy,
    loadChildren: './policy/policy.module#PolicyModule',
    canActivate: [UserService],
    data: { roles: [ROLES_ENUM.SUPER_ADMIN] },
  },
  {
    path: APP_ROUTES.reports,
    loadChildren: './reports/reports.module#ReportsModule',
    canActivate: [UserService],
    data: { roles: [ROLES_ENUM.COMPANY_ADMIN] },
  },
  { path: '*', redirectTo: `/${APP_ROUTES.orders}/${APP_ROUTES.list}`, pathMatch: 'full' },
  { path: '**', redirectTo: `/${APP_ROUTES.orders}/${APP_ROUTES.list}`, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
