import mongoose, { Schema, Document } from 'mongoose';

export interface RequiredCheckInTime {
  dayOfWeek: string;
  startTime: Date;
  endTime: Date;
}

export interface Settings extends Document {
  checkInLocationLongitude: string;
  checkInLocationLatitude: string;
  checkInRadian: string;
  requiredCheckInTime: RequiredCheckInTime[]; // Thiết lập thời gian bắt đầu check in
  earlyAttendanceReward: number; // Được thưởng khi đi sớm
  tenMinuteLateFee: number; // Đóng phạt khi đi trễ 10 phút
  twentyMinuteLateFee: number; // Đóng phạt khi đi trễ 20 phút
  absenceFee: number; // Đóng phạt nghỉ không lí do
  latePaymentFee: number; // Hết hạn thanh toán mà chưa thanh toán sẽ bị tính thêm phí
  createdAt: Date;
  updatedAt: Date;
}

const RequiredCheckInTimeSchema = new mongoose.Schema({
  dayOfWeek: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime:  { type: Date, required: true },
});

const SettingsSchema = new mongoose.Schema({
  checkInLocationLongitude: { type: String, default: '' },
  checkInLocationLatitude: { type: String, default: '' },
  checkInRadian: { type: String, default: '' },
  requiredCheckInTime: { type: [RequiredCheckInTimeSchema], default: [] },
  earlyAttendanceReward: { type: Number, default: '' },
  tenMinuteLateFee: { type: Number, default: '' },
  twentyMinuteLateFee: { type: Number, default: '' },
  absenceFee: { type: Number, default: '' },
  latePaymentFee: { type: Number, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Tạo model từ schema
const SettingsModel = mongoose.model('Settings', SettingsSchema);

export default  SettingsModel;
