import { Component, OnInit, ViewChild } from '@angular/core';

import { UserService } from './providers/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('drawer') drawer;

  constructor(
    public userService: UserService,
  ) { }

  ngOnInit() {
    this.userService.toggleSidebar
      .subscribe(() => {
        setTimeout(
          () => {
            if (this.drawer) {
              this.drawer.close();
            }
          },
          100);
      });
  }

  public toggleMenu() {
    this.drawer.toggle();
  }
}
