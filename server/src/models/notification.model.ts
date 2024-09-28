
import mongoose, { Schema, Document } from 'mongoose';
import { getUTCDate } from '../utils/date.util';
import { SearchUserResponse } from './user.model';

// Define interface for TypeScript type-checking
export interface Notification {
  _id?: mongoose.Types.ObjectId;
  read: mongoose.Types.ObjectId[];
  content: string;
  fromUser: mongoose.Types.ObjectId | null | SearchUserResponse,
  navigateToDetailUrl: string;
  to: mongoose.Types.ObjectId[];
  status: 'DONE' | 'IN_PROCESS',
  createdAt: Date;
}

export interface NotificationToUserResponse {
  _id?: mongoose.Types.ObjectId;
  content: string;
  fromUser: SearchUserResponse | null,
  navigateToDetailUrl: string;
  read: mongoose.Types.ObjectId[];
  isRead: boolean;
  createdAt: Date;
}

export interface FetchNotificationToUserRequestParams {
  idUser: string;
  limit: number;
  page: number;
  status: string;
}

const notificationSchema = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  read: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến model User nếu đây là một User trả lời
    required: true,
  }],
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến model User nếu đây là một User trả lờ
  },
  content: {
    type: String,
    required: true
  },
  navigateToDetailUrl: {
    type: String,
    required: true
  },
  to: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến model User nếu đây là một User trả lời
    required: true,
  }],
  status: {
    type: String,
    enum: ['DONE' , 'IN_PROCESS'],
    default: 'IN_PROCESS'
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
notificationSchema.pre('save', function (next) {
  this.updatedAt = getUTCDate(new Date());
  next();
});

// Tạo model notification
const NotificationModel = mongoose.model<Notification>('notification', notificationSchema);

export default NotificationModel;