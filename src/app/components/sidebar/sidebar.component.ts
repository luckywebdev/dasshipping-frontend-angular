import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { APP_ROUTES } from '../../app.constants';
import { ROLES_STATUS } from '../../enums/roles-status.enum';
import { AccountDTO } from '../../interfaces/models';
import { UserService } from '../../providers/user/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  user: AccountDTO;
  userSubscription: Subscription;

  public categories: Categories[] = [
    {
      name: 'Orders',
      routes: [{
        name: 'Orders', url: '/orders/list',
        icon: 'insert_drive_file',
        isPrimary: true,
        notificationKey: 'notificationOrders',
      }],
      allow: this.isAllowed([
        ROLES_STATUS.COMPANY_ADMIN,
        ROLES_STATUS.DISPATCHER,
      ]),
      isOpen: false,
    },
    {
      name: 'Orders',
      routes: [{
        name: 'Orders',
        url: '/sys-order/list',
        icon: 'insert_drive_file',
        isPrimary: true,
        notificationKey: 'notificationOrders',
      }],
      allow: this.isAllowed([ROLES_STATUS.SUPER_ADMIN]),
      isOpen: false,
    },
    {
      name: 'Carriers',
      routes: [{
        name: 'Carriers', url: '/company/list',
        icon: 'business_outline',
        isPrimary: true,
        notificationKey: 'notificationCompanies',
      }],
      allow: this.isAllowed([ROLES_STATUS.SUPER_ADMIN]),
      isOpen: false,
    },
    {
      name: 'My Team',
      routes: [{
        name: 'My Team', url: '/accounts/list', icon: 'account_box_outline', isPrimary: true,
        notificationKey: 'notificationUsers',
      }],
      allow: this.isAllowed([
        ROLES_STATUS.SUPER_ADMIN,
        ROLES_STATUS.COMPANY_ADMIN,
      ]),
      isOpen: false,
    },
    {
      name: 'Leads',
      routes: [{ name: 'Leads', url: '/leeds/list', icon: 'insert_drive_file', isPrimary: true }],
      allow: this.isAllowed([ROLES_STATUS.SUPER_ADMIN]),
      isOpen: false,
    },
    {
      name: 'Quotes',
      routes: [{
        name: 'Quotes', url: '/quote/list', icon: 'note', isPrimary: true,
        notificationKey: 'notificationQuotes',
      }],
      allow: this.isAllowed([ROLES_STATUS.SUPER_ADMIN]),
      isOpen: false,
    },
    {
      name: 'Load Board',
      routes: [{ name: 'Load Board', url: '/order/list', icon: 'insert_drive_file', isPrimary: true }],
      allow: this.isAllowed([
        ROLES_STATUS.COMPANY_ADMIN,
        ROLES_STATUS.DISPATCHER,
      ]),
      isOpen: false,
    },
    {
      name: 'Trips',
      routes: [{ name: 'Trips', url: '/trip/list', icon: 'library_books', isPrimary: true }],
      allow: this.isAllowed([
        ROLES_STATUS.COMPANY_ADMIN,
        ROLES_STATUS.DISPATCHER,
      ]),
      isOpen: false,
    },
    {
      name: 'Drivers location',
      routes: [{ name: 'Drivers location', url: APP_ROUTES.drivers_location, icon: 'insert_drive_file', isPrimary: true }],
      allow: this.isAllowed([
        ROLES_STATUS.COMPANY_ADMIN,
        ROLES_STATUS.DISPATCHER,
      ]),
      isOpen: false,
    },
    {
      name: 'Price policy',
      routes: [{ name: 'Price policy', url: '/policy/list', icon: 'money', isPrimary: true }],
      allow: this.isAllowed([ROLES_STATUS.SUPER_ADMIN]),
      isOpen: false,
    },
    {
      name: 'Reports',
      routes: [
        { name: 'Reports', icon: 'business', isPrimary: true },
        { name: 'Company Revenue', url: '/reports/revenue', isPrimary: false },
        { name: 'Reports by user', url: '/reports/user', isPrimary: false },
        { name: 'Custom Reports', url: '/reports/custom', isPrimary: false },
      ],
      allow: this.isAllowed([ROLES_STATUS.COMPANY_ADMIN]),
      isOpen: false,
    },
  ];

  private isAllowed(roles: ROLES_STATUS[]) {
    return (
      this.userService.user &&
      roles.indexOf(this.userService.user.roleId) === -1
    );
  }

  public toggleChildren(category: Categories) {
    if (category.name === 'Reports') {
      return this.categories = this.categories.map(
        element => element.name === category.name ? { ...element, isOpen: !element.isOpen } : element);
    }
  }

  constructor(public router: Router, private userService: UserService) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.userService.closeSidebar();
      }
    });
  }

  ngOnInit() {
    this.user = this.userService.user;
    this.userSubscription = this.userService
      .updateUser
      .subscribe((value) => {
        this.user = value;
      });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}

interface Categories {
  name: string;
  routes: Route[];
  allow?: boolean;
  subRoutes?: Route[];
  isOpen?: boolean;
}

interface Route {
  notificationKey?: string;
  name: string;
  url?: string;
  icon?: string;
  allow?: boolean;
  isPrimary: boolean;
}
