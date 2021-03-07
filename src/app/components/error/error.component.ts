import { Component } from '@angular/core';

import { ErrorService } from '../../providers/error/error.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  public error = this.errorService.error;
  constructor(public errorService: ErrorService) { }
}
