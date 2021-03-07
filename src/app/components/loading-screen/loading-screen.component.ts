import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoadingService } from '../../providers/loading/loading.service';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss'],
})
export class LoadingScreenComponent implements OnInit, OnDestroy {
  loading = false;

  loadingSubscription: Subscription;

  constructor(private loadingScreenService: LoadingService) {
  }

  ngOnInit() {
    this.loadingSubscription = this.loadingScreenService
      .loadingStatus
      .subscribe((value) => {
        setTimeout(() => {
          this.loading = value;
          if (value) {
            document.body.setAttribute('style', 'overflow-x:hidden');
          } else {
            document.body.removeAttribute('style');
          }
        })
      });
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }

}
