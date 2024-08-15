import mongoose, { Schema, Document } from 'mongoose';
import { getUTCDate } from '../utils/date.util';

// Define interface for TypeScript type-checking
export interface SelfClaim extends Document {
  reason: string;
  isUser: string;
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
  isUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
  type: {
    type: String,
    enum: ['LATE', 'OFF'],
    required: true
  },
  idUserAccept: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User', // Tham chiếu đến model User nếu có
    default: []
  },
  idUserReject: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User', // Tham chiếu đến model User nếu có
    default: []
  },
  status: {
    type: String,
    required: true
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
selfClaimSchema.pre('save', function(next) {
  this.updatedAt = getUTCDate(new Date());
  next();
});

// Tạo model SelfClaim
const SelfClaim = mongoose.model('SelfClaim', selfClaimSchema);

module.exports = SelfClaim;
