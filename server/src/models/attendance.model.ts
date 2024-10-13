import mongoose, { Schema, Document } from 'mongoose';
import { getUTCDate } from '../utils/date.util';

// Define interface for TypeScript type-checking
export interface Attendance {
  _id?: mongoose.Types.ObjectId,
  amount: number;
  idUser: mongoose.Types.ObjectId;
  checkIn: Date | null;
  checkout: Date | null;
  participationDate: Date | null;
  status?: 'LATE' | 'ON_TIME' | 'OFF' | 'DONE' | 'WAITING' | 'EARLY';
  createdAt?: Date;
  updatedAt?: Date;
}

const attendanceSchema = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
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
    type: Date,
  },
  checkout: {
    type: Date,
  },
  participationDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['LATE' , 'ON_TIME' , 'OFF' , 'DONE' , 'WAITING' , 'EARLY'],
    default: 'WAITING'
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