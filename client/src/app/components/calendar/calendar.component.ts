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
    return now.getDay() === +day && now.getMonth() === +month && now.getFullYear() === +year;
  }

  generateCalendar(month: number, year: number) {
    const tempDays: DateInfo[] = [];
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const lastDateOfMonth = new Date(year, month - 1, 0).getDate();
    const dayOfWeekList = ['Thứ 6','Thứ 7','Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5'];
    for (let i = firstDay - 1; i >= 0; i--) {
      tempDays.push({
        date: `${(lastDateOfMonth - i)}-${this.selectedMonth}-${this.selectedYear}`,
        day: (lastDateOfMonth - i).toString(),
        month: this.selectedMonth.toString(),
        year: this.selectedYear.toString(),
        dayOfWeek: 0,
        isCurrentDay: this.checkCurrentDate(lastDateOfMonth - i, this.selectedMonth, this.selectedYear),
        attendances:[],
        isPlay: false,
        isLated: false,
        isOnTime: false,
        isDisabled: true
      });
    }
    for (let day = 1; day <= lastDate; day++) {
      tempDays.push({
        date: `${day}-${this.selectedMonth}-${this.selectedYear}`,
        day: day.toString(),
        month: this.selectedMonth.toString() + 1,
        year: this.selectedYear.toString(),
        dayOfWeek: 0,
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
        date: `${day}-${this.selectedMonth}-${this.selectedYear}`,
        day: day.toString(),
        month: this.selectedMonth.toString() + 2,
        year: this.selectedYear.toString(),
        dayOfWeek: 0,
        isCurrentDay: this.checkCurrentDate(day, this.selectedMonth, this.selectedYear),
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
