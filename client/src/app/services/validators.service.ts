import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
  static fieldRequired(messageKey: string): ValidationErrors | null {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if ((!control.value || (typeof control.value === 'string' && !control.value.trim()) 
        || (Array.isArray(control.value) && !control.value.length))) {
        return {
          required: {
            invalid: true,
            errorMessage: messageKey
          }
        };
      }
      return null;
    }
  }

  static dateRangeRequired(messageKey: string): ValidationErrors | null {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value && (!control.value.startDate || !control.value.endDate)) {
        return {
          required: {
            invalid: true,
            errorMessage: messageKey
          }
        };
      }
      return null;
    }
  }
}