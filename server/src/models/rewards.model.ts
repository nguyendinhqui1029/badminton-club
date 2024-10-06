import mongoose, { Schema, Document } from 'mongoose';
import { getUTCDate } from '../utils/date.util';

// Define interface for TypeScript type-checking
export interface Reward {
  _id?: mongoose.Types.ObjectId,
  name: string;
  point: string;
  banner: string;
  startDate: Date | null;
  endDate: Date | null;
  type: string;
  status?: 'IN_PROGRESS' | 'WAITING' | 'DONE';
  guest: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const rewardSchema = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  name: {
    type: String,
    required: true
  },
  point: {
    type: Number,
    required: true,
  },
  banner: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  guest: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến model User nếu đây là một User trả lời
    required: true,
  }],
  type:  {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['IN_PROGRESS' , 'WAITING' , 'DONE'],
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
rewardSchema.pre('save', function(next) {
  this.updatedAt = getUTCDate(new Date());
  next();
});

// Tạo model RewardModel
const RewardModel = mongoose.model<Reward>('Reward', rewardSchema);

export default RewardModel;