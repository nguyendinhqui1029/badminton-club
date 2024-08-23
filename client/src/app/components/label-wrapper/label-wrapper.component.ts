import { Component, input } from '@angular/core';

@Component({
  selector: 'app-label-wrapper',
  standalone: true,
  imports: [],
  templateUrl: './label-wrapper.component.html',
  styleUrl: './label-wrapper.component.scss'
})
export class LabelWrapperComponent {
  label = input.required<string>();
  isRequired = input(false);
  errorMessage = input<string>();
  idLabel= input.required<string>();
}
