import { Component, computed, input } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-label-wrapper',
  standalone: true,
  imports: [],
  templateUrl: './label-wrapper.component.html',
  styleUrl: './label-wrapper.component.scss'
})
export class LabelWrapperComponent {
  label = input.required<string>();
  isRequired = input<boolean>(false);
  errorsControl = input<ValidationErrors | null>();
  errorsGroup = input<ValidationErrors | null>();
  isTouched = input<boolean>(false);
  idLabel= input.required<string>();

  errorMessageFormControl = computed(()=>{
    if(this.errorsControl()) {
      const key = Object.keys(this.errorsControl() as ValidationErrors)[0];
      return (this.errorsControl() as ValidationErrors)[key]?.errorMessage;
    }
  });

  errorMessageFormGroup = computed(()=>{
    if(this.errorsGroup()) {
      const key = Object.keys(this.errorsGroup() as ValidationErrors)[0];
      return (this.errorsGroup() as ValidationErrors)[key]?.errorMessage;
    }
  });
}
