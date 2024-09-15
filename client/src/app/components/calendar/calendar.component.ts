import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonOption } from '@app/models/common-option.model';
import { DateInfo } from '@app/models/date-info.model';
import { DropdownModule } from 'primeng/dropdown';
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [DropdownModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  days = signal<DateInfo[]>([]);
  year: string = new Date().getFullYear().toString();
  yearOptions: CommonOption[] = [];
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();
  ngOnInit(): void {
    this.generateYears(this.selectedYear);
    this.days.set(this.generateCalendar(this.selectedMonth, this.selectedYear));
  }

  onChangeMonth(month: number) {
    this.selectedMonth = this.selectedMonth + month;
    if(this.selectedMonth >= 11) {
      this.selectedYear = this.selectedYear + 1;
      this.selectedMonth = 0;
      this.days.set(this.generateCalendar(this.selectedMonth, this.selectedYear));
      return;
    }
    if(this.selectedMonth <= 0 ) {
      this.selectedYear = this.selectedYear - 1;
      this.selectedMonth = 11;
      this.days.set(this.generateCalendar(this.selectedMonth, this.selectedYear));
      return;
    }
    this.days.set(this.generateCalendar(this.selectedMonth, this.selectedYear));
  }
  checkCurrentDate(day: number, month: number, year: number) {
    const now = new Date();
    return now.getDate() === +day && now.getMonth() + 1 === +month && now.getFullYear() === +year;
  }

  getDay(date: Date) {
    const dayOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return dayOfWeek[date.getDay()];
  }
  generateCalendar(month: number, year: number) {
    const tempDays: DateInfo[] = [];
    const firstDay = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month - 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) {
      tempDays.push({
        day: (lastDateOfMonth - firstDay + i),
        month: this.selectedMonth,
        year: this.selectedYear,
        dayOfWeek: this.getDay(new Date(`${this.selectedYear}-${this.selectedMonth}-${(lastDateOfMonth - firstDay + i)}`)),
        isCurrentDay: this.checkCurrentDate(lastDateOfMonth - i, this.selectedMonth, this.selectedYear),
        attendances:[],
        isPlay: false,
        isLated: false,
        isOnTime: false,
        isDisabled: true
      });
    }

    const lastDate = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= lastDate; day++) {
      tempDays.push({
        day: day,
        month: this.selectedMonth,
        year: this.selectedYear,
        dayOfWeek: this.getDay(new Date(`${this.selectedYear}-${this.selectedMonth + 1}-${day}`)),
        isCurrentDay: this.checkCurrentDate(day, this.selectedMonth, this.selectedYear),
        attendances:[],
        isPlay: true,
        isLated: false,
        isDisabled: false,
        isOnTime: false,
      });
    }
    const maxDay= 35 - tempDays.length;
    for (let day = 1; day <= maxDay; day++) {
      tempDays.push({
        day: day,
        month: this.selectedMonth + 2,
        year: this.selectedYear,
        dayOfWeek: this.getDay(new Date(`${this.selectedYear}-${this.selectedMonth + 2}-${day}`)),
        isCurrentDay: this.checkCurrentDate(day, this.selectedMonth + 2, this.selectedYear),
        attendances:[],
        isPlay: false,
        isLated: false,
        isDisabled: true,
        isOnTime: false,
      });
    }
    return tempDays;
  }

  generateYears(selectedYear: number) {
    const maxYear = selectedYear + 100;
    const minYear = selectedYear - 100;
    for(let year= maxYear; year >= minYear; year--) {
      this.yearOptions.push({
        label: year.toString(),
        value: year.toString()
      })
    }
  }
}
