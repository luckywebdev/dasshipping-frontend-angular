import { Pipe, PipeTransform } from '@angular/core';

import { REGEX_PHONE } from '../constants';

@Pipe({ name: 'phone' })
export class PhoneNumberPipe implements PipeTransform {
  transform(value: string): string {
    if (REGEX_PHONE.test(value)) {
      return value;
    }
    const clearPhone = value.replace(/[^a-zA-Z0-9]/g, '');
    const firstParam = clearPhone.length > 0 ? `(${clearPhone.slice(0, 3)}${clearPhone.length > 3 ? `)` : ''}` : '';
    const secondParam = clearPhone.length > 3 ? `-${clearPhone.slice(3, 6)}` : '';
    const oldParam = clearPhone.length > 6 ? `-${clearPhone.slice(6, 10)}` : '';
    return `${firstParam}${secondParam}${oldParam}`;
  }
}
