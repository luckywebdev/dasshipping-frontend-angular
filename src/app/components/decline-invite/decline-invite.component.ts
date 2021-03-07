import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingService } from '../../providers/loading/loading.service';
import { RegisterService } from '../../providers/register/register.service';

@Component({
  selector: 'app-decline-invite',
  templateUrl: './decline-invite.component.html',
  styleUrls: ['./decline-invite.component.scss'],
})
export class DeclineInviteComponent implements OnInit {
  message: string;
  hash: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private registerService: RegisterService,
  ) { }

  ngOnInit() {
    this.loadingService.startLoading();
    this.hash = this.route.snapshot.paramMap.get('hash');
    this.declineInvitation();
  }

  private success() {
    this.message = 'Your invitation was declined.';
    this.loadingService.stopLoading();
  }

  private error() {
    this.message = 'Your invitation has expired.';
    this.loadingService.stopLoading();
  }

  private declineInviteCarrier() {
    this.registerService.declineInviteCarrier(this.hash)
      .subscribe(
        () => this.success(),
        () => this.error());
  }

  private declineInviteAccount() {
    this.registerService.declineInviteAccount(this.hash)
      .subscribe(
        () => this.success(),
        () => this.error());
  }

  private declineInvitation() {
    const { url } = this.router;
    if (url.includes('register-carrier-decline')) {
      this.declineInviteCarrier();
    } else {
      this.declineInviteAccount();
    }
  }
}
