import mongoose, { Schema, Document } from 'mongoose';
import { getUTCDate } from '../utils/date.util';

// Define interface for TypeScript type-checking
export interface SelfClaim extends Document {
  reason: string;
  idAttendance: string;
  type: 'LATE' | 'OFF';
  idUserAccept: string[];
  idUserReject: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Định nghĩa schema cho SelfClaim
const selfClaimSchema = new mongoose.Schema({
  reason: {
    type: String,
    required: true
  },
  idAttendance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attendance', // Tham chiếu đến model Attendance nếu có
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['LATE', 'OFF'],
    required: true
  },
  idUserAccept: {
    type: Array<mongoose.Schema.Types.ObjectId>,
    ref: 'User', // Tham chiếu đến model User nếu có
    default: []
  },
  idUserReject: {
    type: Array<mongoose.Schema.Types.ObjectId>,
    ref: 'User', // Tham chiếu đến model User nếu có
    default: []
  },
  status: {
    type: String,
    required: true
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
selfClaimSchema.pre('save', function(next) {
  this.updatedAt = getUTCDate(new Date());
  next();
});

// Tạo model SelfClaim
const SelfClaimModel = mongoose.model<SelfClaim>('SelfClaim', selfClaimSchema);

export default SelfClaimModel;
