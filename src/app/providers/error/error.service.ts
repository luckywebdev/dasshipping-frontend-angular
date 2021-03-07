import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class ErrorService {
  public error = {
    error: '',
    message: '',
    statusCode: '',
  };

  constructor(private router: Router) { }

  navigate(err) {
    const { message, error, statusCode } = err.error;
    this.error = { error, message, statusCode };
    this.router.navigateByUrl('/error');
  }
}
