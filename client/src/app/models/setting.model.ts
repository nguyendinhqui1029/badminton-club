import { DayTimePicker } from "./day-time-picker.model";

export interface SettingsRequestBody {
  checkInLocationLongitude: string;
  checkInLocationLatitude: string;
  checkInRadian: string;
  requiredCheckInTime: DayTimePicker[];
  earlyAttendanceReward: string;
  tenMinuteLateFee: string;
  twentyMinuteLateFee: string;
  absenceFee: string;
  latePaymentFee: string;
}

export interface SettingsResponseValue {
  id: string;
  checkInLocationLongitude: string;
  checkInLocationLatitude: string;
  checkInRadian: string;
  requiredCheckInTime: DayTimePicker[];
  earlyAttendanceReward: string;
  tenMinuteLateFee: string;
  twentyMinuteLateFee: string;
  absenceFee: string;
  latePaymentFee: string;
  updatedAt: string;
}