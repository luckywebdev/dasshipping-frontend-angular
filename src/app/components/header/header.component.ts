import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { APP_ROUTES } from '../../app.constants';
import { ROLES_STATUS } from '../../enums';
import { AccountDTO } from '../../interfaces/models';
import { LoadingService } from '../../providers/loading/loading.service';
import { UserService } from '../../providers/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  nameRoute: string;
  notifications: number;
  notificationKey: string;
  roles = ROLES_STATUS;
  companyName: string;
  dotNumber: string;
  userSubscription: Subscription;
  @Input() user: AccountDTO;
  @Output() toggleMenu: EventEmitter<any> = new EventEmitter();

  constructor(
    private userService: UserService,
    private loadingService: LoadingService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.setCompanyName();
    this.changeEventsRouter();
    this.setRouteName();
    this.userSubscription = this.userService
      .updateUser
      .subscribe((value) => {
        if (this.notificationKey) {
          this.notifications = value && value[this.notificationKey];
        }
      });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private setCompanyName() {
    const { companyName, company } = this.user;
    if (company) {
      this.companyName = company && company.name;
      this.dotNumber = company && company.dotNumber;
    }
    if (companyName && !company) {
      this.companyName = companyName;
    }
  }

  private changeEventsRouter() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setRouteName();
      }
    });
  }

  private setRouteName() {
    let snapshot = this.route.snapshot;
    let activated = this.route.firstChild;
    if (activated != null) {
      while (activated != null) {
        snapshot = activated.snapshot;
        activated = activated.firstChild;
      }
    }
    this.nameRoute = snapshot.data['nameRoute'] || '';
    this.notificationKey = snapshot.data['notificationKey'] || '';

    if (this.notificationKey) {
      this.notifications = this.user && this.user[this.notificationKey];
    }
  }

  public toogleSideMenu() {
    this.toggleMenu.emit();
  }

  public async logout() {
    this.loadingService.startLoading();
    await this.userService.logout();
    this.loadingService.stopLoading();
  }

  public myProfile() {
    if (this.userService.user.roleId === ROLES_STATUS.SUPER_ADMIN) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/accounts', 'me']);
    }
  }

  public myCompany() {
    this.router.navigate([APP_ROUTES.my_company]);
  }

  public changePassword() {
    this.router.navigate([APP_ROUTES.reset_password]);
  }
}
