import { FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';

export class PasswordStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null): boolean {
    const { password, confirmPassword } = control.parent.value;
    return confirmPassword && password !== confirmPassword;
  }
}
