import { Attendance } from "@app/models/attendance.model";

export interface DateInfo {
  day: number;
  month: number;
  year: number;
  isCurrentDay: boolean;
  attendances: Attendance[];
  dayOfWeek: string;
  isOff: boolean,
  isPlay: boolean;
  isLated: boolean;
  isDisabled: boolean;
  isOnTime: boolean;
}