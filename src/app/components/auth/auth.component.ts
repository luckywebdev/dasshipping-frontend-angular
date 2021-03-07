import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  public selectedTab = 0;

  public changeTab = (index) => {
    this.selectedTab = index;
  }
}
