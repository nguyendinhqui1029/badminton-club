import mongoose, { Schema, Document } from 'mongoose';
import { getUTCDate } from '../utils/date.util';

// Define interface for TypeScript type-checking
export interface Attendance extends Document {
  amount: number;
  isUser: string;
  checkIn: string;
  checkout: string;
  status: 'LATE' | 'ON_TIME' | 'OFF';
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  isUser: {
    type: String,
    required: true
  },
  checkIn: {
    type: String, // Sử dụng kiểu String cho thời gian, có thể chuyển đổi sau
    required: true
  },
  checkout: {
    type: String, // Sử dụng kiểu String cho thời gian, có thể chuyển đổi sau
    required: true
  },
  status: {
    type: String,
    enum: ['LATE', 'ON_TIME', 'OFF'],
    required: true,
    default: 'ON_TIME'
  },
  createdAt: {
    type: String,
    default: getUTCDate(new Date())
  },
  updatedAt: {
    type: String,
    default: getUTCDate(new Date())
  }
});
// Cập nhật thời gian cập nhật mỗi khi tài liệu được lưu
attendanceSchema.pre('save', function(next) {
  this.updatedAt = getUTCDate(new Date());
  next();
});

// Tạo model Attendance
const AttendanceModel = mongoose.model<Attendance>('Attendance', attendanceSchema);

export default AttendanceModel;