import { Component } from '@angular/core';
import { CalendarComponent } from '@app/components/calendar/calendar.component';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CalendarComponent],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss'
})
export class AttendanceComponent {

}
