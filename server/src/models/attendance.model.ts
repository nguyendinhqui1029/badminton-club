import mongoose, { Schema, Document } from 'mongoose';
import { getUTCDate } from '../utils/date.util';

// Define interface for TypeScript type-checking
export interface Attendance extends Document {
  amount: number;
  idUser: string;
  checkIn: string;
  checkout: string;
  status: 'LATE' | 'ON_TIME' | 'OFF' | 'DONE' | 'WAITING' | 'EARLY';
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến model User nếu đây là một User trả lời
    required: true,
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
    type: Date,
    default: getUTCDate(new Date())
  },
  updatedAt: {
    type: Date,
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