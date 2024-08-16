import mongoose, { Schema, Document } from 'mongoose';

export interface Settings extends Document {
  checkInLocationLongitude: string;  // Kinh độ của điểm kiểm tra vào
  checkInLocationLatitude: string;   // Vĩ độ của điểm kiểm tra vào
  checkInRadian: string;             // Góc kiểm tra vào dưới dạng chuỗi (có thể là một giá trị góc hoặc định dạng khác)
  checkInDate: string;
  checkOutDate: string;
  earlyAttendanceReward: number;     // Phần thưởng cho việc đến sớm
  tenMinuteLateFee: number;          // Phí trễ 10 phút
  twentyMinuteLateFee: number;       // Phí trễ 20 phút
  absenceFee: number;                // Phí vắng mặt
  latePaymentFee: number;            // Phí thanh toán trễ
}

// Định nghĩa schema cho AttendanceSettings
const settingsSchema = new mongoose.Schema({
  checkInLocationLongitude: {
    type: String,
    required: true
  },
  checkInLocationLatitude: {
    type: String,
    required: true
  },
  checkInRadian: {
    type: String,
    required: true
  },
  checkInDate: {
    type: String,
    required: true
  },
  checkOutDate: {
    type: String,
    required: true
  },
  earlyAttendanceReward: {
    type: Number,
    required: true
  },
  tenMinuteLateFee: {
    type: Number,
    required: true
  },
  twentyMinuteLateFee: {
    type: Number,
    required: true
  },
  absenceFee: {
    type: Number,
    required: true
  },
  latePaymentFee: {
    type: Number,
    required: true
  }
}, {
  timestamps: true // Tự động thêm createdAt và updatedAt
});

// Tạo model AttendanceSettings
const SettingsModel = mongoose.model<Settings>('Settings', settingsSchema);

export default  SettingsModel;
