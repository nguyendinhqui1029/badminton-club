import mongoose, { Schema, Document } from 'mongoose';


interface CheckInTime {
  dayOfWeek: string;
  time: string;
}

export interface RequiredCheckInTime {
  startTime: CheckInTime;
  endTime: CheckInTime;
}

export interface Settings extends Document {
  checkInLocationLongitude: string;
  checkInLocationLatitude: string;
  checkInRadian: string;
  requiredCheckInTime: RequiredCheckInTime; // Thiết lập thời gian bắt đầu check in
  earlyAttendanceReward: number; // Được thưởng khi đi sớm
  tenMinuteLateFee: number; // Đóng phạt khi đi trễ 10 phút
  twentyMinuteLateFee: number; // Đóng phạt khi đi trễ 20 phút
  absenceFee: number; // Đóng phạt nghỉ không lí do
  latePaymentFee: number; // Hết hạn thanh toán mà chưa thanh toán sẽ bị tính thêm phí
}

const CheckInTimeSchema = new Schema({
  dayOfWeek: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

const RequiredCheckInTimeSchema = new Schema({
  startTime: {
    type: CheckInTimeSchema,
    required: true,
  },
  endTime: {
    type: CheckInTimeSchema,
    required: true,
  },
});

const settingsSchema = new Schema({
  checkInLocationLongitude: {
    type: String,
    required: true, // Yêu cầu trường này là bắt buộc
  },
  checkInLocationLatitude: {
    type: String,
    required: true, // Yêu cầu trường này là bắt buộc
  },
  checkInRadian: {
    type: String,
    required: true, // Yêu cầu trường này là bắt buộc
  },
  requiredCheckInTime: {
   type: RequiredCheckInTimeSchema,
   required: true
  },
  earlyAttendanceReward: {
    type: Number,
    required: true, // Yêu cầu trường này là bắt buộc
  },
  tenMinuteLateFee: {
    type: Number,
    required: true, // Yêu cầu trường này là bắt buộc
  },
  twentyMinuteLateFee: {
    type: Number,
    required: true, // Yêu cầu trường này là bắt buộc
  },
  absenceFee: {
    type: Number,
    required: true, // Yêu cầu trường này là bắt buộc
  },
  latePaymentFee: {
    type: Number,
    required: true, // Yêu cầu trường này là bắt buộc
  },
}, {
  timestamps: true, // Tự động thêm createdAt và updatedAt
});

// Tạo model từ schema
const SettingsModel = mongoose.model('Settings', settingsSchema);

export default  SettingsModel;
