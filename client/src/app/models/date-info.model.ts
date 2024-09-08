import { Attendance } from "@app/models/attendance.model";

export interface DateInfo {
  date: string;
  day: string;
  month: string;
  year: string;
  isCurrentDay: boolean;
  attendances: Attendance[];
  dayOfWeek: number;
  isPlay: boolean;
  isLated: boolean;
  isDisabled: boolean;
  isOnTime: boolean;
}