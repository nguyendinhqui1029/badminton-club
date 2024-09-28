import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject, OnInit, signal } from '@angular/core';
import { ControlValueAccessor, FormArray, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonOption } from '@app/models/common-option.model';
import { DayTimePicker } from '@app/models/day-time-picker.model';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-day-time-picker',
  standalone: true,
  imports: [CommonModule, CalendarModule, ReactiveFormsModule],
  templateUrl: './day-time-picker.component.html',
  styleUrl: './day-time-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DayTimePickerComponent),
      multi: true
    }]
})
export class DayTimePickerComponent implements ControlValueAccessor, OnInit {
 
  public onChange!: Function;
  public onTouched!: Function;
  public isDisabled: boolean = false;

  private formBuilder: FormBuilder = inject(FormBuilder);
  days: CommonOption[] = [
    {label: 'Thứ 2', value: 'T2'},
    {label: 'Thứ 3', value: 'T3'},
    {label: 'Thứ 4', value: 'T4'},
    {label: 'Thứ 5', value: 'T5'},
    {label: 'Thứ 6', value: 'T6'},
    {label: 'Thứ 7', value: 'T7'},
    {label: 'Chủ Nhật', value: 'CN'},
  ];
  formGroup!: FormGroup;
  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      items: this.formBuilder.array([])
    });
    this.days.forEach(item=>{
      (this.formGroup.get('items') as FormArray).push(this.formBuilder.group({dayOfWeek: item.value, startTime: '', endTime:  ''}));
    });
    this.formGroup.valueChanges.subscribe(value=>{
      this.onChange?.(value.items);
      this.onTouched?.();
    })
  }
  writeValue(value: DayTimePicker[]): void {
    if(value && value.length) {
      (this.formGroup.get('items') as FormArray).clear();
      this.days.forEach(item=>{
        const dayValue = value.find(day=>item.value === day.dayOfWeek);
        (this.formGroup.get('items') as FormArray)?.push(this.formBuilder.group({
          dayOfWeek: item.value, 
          startTime: dayValue?.startTime ? new Date(dayValue?.startTime) : null, 
          endTime: dayValue?.endTime ? new Date(dayValue?.endTime) : null }));
      });
      return;
    }
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
  
}
