import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { attendanceStatus, dayOfWeek } from '@app/constants/common.constant';
import { AttendanceResponseValue } from '@app/models/attendance.model';
import { CommonOption } from '@app/models/common-option.model';
import { DateInfo } from '@app/models/date-info.model';
import { SettingsResponseValue } from '@app/models/setting.model';
import { AttendanceService } from '@app/services/attendance.service';
import { SettingsService } from '@app/services/settings.service';
import { UserService } from '@app/services/user.service';
import { DropdownModule } from 'primeng/dropdown';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [DropdownModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {

  private settingsService: SettingsService = inject(SettingsService);
  private attendanceService: AttendanceService = inject(AttendanceService);
  private userService: UserService = inject(UserService);

  days = signal<DateInfo[]>([]);
  year: string = new Date().getFullYear().toString();
  yearOptions: CommonOption[] = [];
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();
  setting!:SettingsResponseValue;
  attendanceByUser!:AttendanceResponseValue[];

  ngOnInit(): void {
    this.generateYears(this.selectedYear);
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1 < 10 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const lastDate = new Date(year, currentDate.getMonth() + 1, 0).getDate();
    forkJoin([this.attendanceService.getAttendanceByIdUser(this.userService.currentUserLogin.getValue().id, `${year}-${month}-01`, `${year}-${month}-${lastDate}`),this.settingsService.getSetting()]).subscribe(([attendanceByIdUserResponse,settingResponse])=>{
      if(settingResponse.statusCode !== 200 || attendanceByIdUserResponse.statusCode !== 200) {
        return;
      }
      this.attendanceByUser = attendanceByIdUserResponse.data || [];
      this.setting = settingResponse.data;
      this.days.set(this.generateCalendar(this.selectedMonth, this.selectedYear));
    });
   
  }

  getAttendanceByMonth(startDate: string, endDate: string) {
    this.attendanceService.getAttendanceByIdUser(this.userService.currentUserLogin.getValue().id, startDate, endDate).subscribe(response=>{
      if(response.statusCode !==200){
        return;
      }
      this.attendanceByUser = response.data || [];
    });
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
    return now.getDate() === +day && now.getMonth() === +month && now.getFullYear() === +year;
  }

  getDay(date: Date) {
    return dayOfWeek[date.getDay()];
  }

  checkPlayDate(date: Date) {
    return (
      new Date(this.setting.updatedAt).getTime() <= date.getTime()) 
      && !!this.setting?.requiredCheckInTime?.find(item=>item.dayOfWeek === this.getDay(date))
      || !!this.attendanceByUser.find(item=>`${new Date(item.createdAt).getFullYear()}-${new Date(item.createdAt).getMonth()}-${new Date(item.createdAt).getDate()}` === `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
  }

  checkAttendanceStatus(status: string, date: string) {
    return !!this.attendanceByUser.find(item=>item.status === status && `${new Date(item.createdAt)?.getFullYear()}-${new Date(item.createdAt).getMonth() + 1}-${new Date(item.createdAt).getDate()}` === date)
  }

  generateCalendar(month: number, year: number) {
    const tempDays: DateInfo[] = [];
    const firstDay = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month, 0).getDate();
    for (let i = 1; i <= firstDay; i++) {
      const date = new Date(`${this.selectedYear}-${this.selectedMonth}-${(lastDateOfMonth - firstDay + i)}`);
      tempDays.push({
        day: (lastDateOfMonth - firstDay + i),
        month: this.selectedMonth,
        year: this.selectedYear,
        dayOfWeek: this.getDay(date),
        isCurrentDay: this.checkCurrentDate(lastDateOfMonth - i, this.selectedMonth, this.selectedYear),
        attendances:[],
        isPlay: this.checkPlayDate(date),
        isOff: this.checkAttendanceStatus(attendanceStatus.OFF, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`),
        isLated: this.checkAttendanceStatus(attendanceStatus.LATE, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`),
        isOnTime: this.checkAttendanceStatus(attendanceStatus.ON_TIME, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`),
        isDisabled: true
      });
    }

    const lastDate = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= lastDate; day++) {
      const date = new Date(`${this.selectedYear}-${this.selectedMonth + 1}-${day}`);
      tempDays.push({
        day: day,
        month: this.selectedMonth,
        year: this.selectedYear,
        dayOfWeek: this.getDay(date),
        isCurrentDay: this.checkCurrentDate(day, this.selectedMonth, this.selectedYear),
        attendances:[],
        isPlay: this.checkPlayDate(date),
        isOff: this.checkAttendanceStatus(attendanceStatus.OFF, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`),
        isLated: this.checkAttendanceStatus(attendanceStatus.LATE, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`),
        isDisabled: false,
        isOnTime: this.checkAttendanceStatus(attendanceStatus.ON_TIME, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`),
      });
    }
    const maxDay= 42 - tempDays.length;
    for (let day = 1; day <= maxDay; day++) {
      const date = new Date(`${this.selectedYear}-${this.selectedMonth + 2}-${day}`);
      tempDays.push({
        day: day,
        month: this.selectedMonth + 2,
        year: this.selectedYear,
        dayOfWeek: this.getDay(date),
        isCurrentDay: this.checkCurrentDate(day, this.selectedMonth + 2, this.selectedYear),
        attendances:[],
        isPlay: this.checkPlayDate(date),
        isOff: this.checkAttendanceStatus(attendanceStatus.OFF, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`),
        isLated: this.checkAttendanceStatus(attendanceStatus.LATE, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`),
        isDisabled: true,
        isOnTime: this.checkAttendanceStatus(attendanceStatus.ON_TIME, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`),
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
