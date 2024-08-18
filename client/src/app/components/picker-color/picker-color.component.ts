import { Component, forwardRef, input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonOption } from '@app/models/common-option.model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-picker-color',
  standalone: true,
  imports: [],
  templateUrl: './picker-color.component.html',
  styleUrl: './picker-color.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PickerColorComponent),
      multi: true
    }
  ]
})
export class PickerColorComponent implements ControlValueAccessor, OnChanges {

  backgroundConfigOptions= input<CommonOption[]> ([
    { value: 'bg-gray-color-20', label: 'placeholder:text-black-100 text-black'},
    { value: 'bg-vivid_purple', label: 'text-white placeholder:text-gray-200'},
    { value: 'bg-red-color', label: 'text-white placeholder:text-gray-200'},
    { value: 'bg-very_dark_black', label: 'text-white placeholder:text-gray-200'},
    { value: 'bg-gradient-to-b from-vivid_red to-deep_blue', label: 'text-white placeholder:text-gray-200'},
    { value: 'bg-gradient-to-b from-royal_blue to-neon_pink', label: 'text-white placeholder:text-gray-200'},
    { value: 'bg-yellow-to-red', label: 'text-white placeholder:text-gray-200'},
    { value: 'bg-gradient-to-b from-slate_gray to-gunmetal_gray', label: 'text-white placeholder:text-gray-200'},
    { value: 'bg-badminton', label: 'text-vivid_purple placeholder:text-gray-200'},
    { value: 'bg-white_to_pink', label: 'text-black placeholder:text-gray-200'},
  ]);
  public onChange!: Function;
  public onTouched!: Function;
  public value: string = '';
  public isDisabled: boolean = false;
  public isSelected!: CommonOption;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['backgroundConfigOptions']?.currentValue?.length) {
      this.isSelected = changes['backgroundConfigOptions']?.currentValue[0];
    }
  }
  writeValue(value: string): void {
    if(value) {
      this.value = value;
      const valueAfterSplit = this.value.split('==/==');
      this.isSelected = {
        value: valueAfterSplit[0],
        label: valueAfterSplit[1]
      }
      return;
    }
    this.value = value;
    this.isSelected = { value: 'bg-gray-color-20', label: 'placeholder:text-black-100 text-black'};
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onClickSelectBackground(item: CommonOption) {
    if(this.isDisabled) {
      return;
    }
    
    const value = `${item.value}==/==${item.label}`;
    this.onChange(value);
    this.onTouched();
    this.isSelected = item;
  }

}
