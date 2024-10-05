import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
  static checkboxRequired(message: string): ValidationErrors | null {
    return (control: AbstractControl): {
      [key: string]: {
        invalid: boolean,
        errorMessage: string
      }
    } | null => {
      if (!control.value) {
        return {
          required: {
            invalid: true,
            errorMessage: message
          }
        };
      }
      return null;
    }
  }

  static fieldRequired(message: string): ValidationErrors | null {
    return (control: AbstractControl): {
      [key: string]: {
        invalid: boolean,
        errorMessage: string
      }
    } | null => {
      if ((!control.value || (typeof control.value === 'string' && !control.value.trim())
        || (Array.isArray(control.value) && !control.value.length))) {
        return {
          required: {
            invalid: true,
            errorMessage: message
          }
        };
      }
      return null;
    }
  }

  static dateRangeRequired(message: string): ValidationErrors | null {
    return (control: AbstractControl): {
      [key: string]: {
        invalid: boolean,
        errorMessage: string
      }
    } | null => {
      if (control.value && (!control.value.startDate || !control.value.endDate)) {
        return {
          required: {
            invalid: true,
            errorMessage: message
          }
        };
      }
      return null;
    }
  }

  static passwordsMatch(formGroup: FormGroup, message: string) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword ? {
      mismatch: {
        invalid: true,
        errorMessage: message
      }
    } : null;
  }

  static minLength(minLength: number, message: string) {
    return (control: AbstractControl): {
      [key: string]: {
        invalid: boolean,
        errorMessage: string
      }
    } | null => {
      if (control.value && control.value.length < minLength) {
        return {
          required: {
            invalid: true,
            errorMessage: message
          }
        };
      }
      return null;
    }
  }

  static timeRangeRequired(message: string): ValidationErrors | null {
    return (control: AbstractControl): {
      [key: string]: {
        invalid: boolean,
        errorMessage: string
      }
    } | null => {
      for(let index = 0 ; index < control.value.length; index++){
        if ((control.value[index].startTime && !control.value[index].endTime) || (!control.value[index].startTime && control.value[index].endTime) ) {
          return {
            required: {
              invalid: true,
              errorMessage: message
            }
          };
        }
      };
      return null;
    }
  }

  static timeRangeInvalid(message: string): ValidationErrors | null {
    return (control: AbstractControl): {
      [key: string]: {
        invalid: boolean,
        errorMessage: string
      }
    } | null => {
      for(let index = 0 ; index < control.value.length; index++){
        if (control.value[index].startTime && control.value[index].endTime && new Date(control.value[index].startTime).getTime() > new Date(control.value[index].endTime).getTime()) {
          return {
            timeRangeInvalid: {
              invalid: true,
              errorMessage: message
            }
          };
        }
      };

      return null;
    }
  }
}