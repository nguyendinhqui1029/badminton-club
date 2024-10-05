
import mongoose, { Schema, Document } from 'mongoose';
import { getUTCDate } from '../utils/date.util';
import { SearchUserResponse } from './user.model';

// Define interface for TypeScript type-checking
export interface Notification {
  _id?: mongoose.Types.ObjectId;
  read: mongoose.Types.ObjectId[];
  title: string;
  content: string;
  fromUser: mongoose.Types.ObjectId | null | SearchUserResponse,
  navigateToDetailUrl: string;
  to: mongoose.Types.ObjectId[];
  status: 'DONE' | 'IN_PROCESS' | 'DENIED',
  createdAt: Date;
  type: string;
}

export interface NotificationToUserResponse {
  _id?: mongoose.Types.ObjectId;
  title: string;
  content: string;
  fromUser: SearchUserResponse | null,
  navigateToDetailUrl: string;
  read: mongoose.Types.ObjectId[];
  isRead: boolean;
  createdAt: Date;
  type: string;
  to: mongoose.Types.ObjectId[];
}

export interface FetchNotificationToUserRequestParams {
  idUser: string;
  limit: number;
  page: number;
  status: string;
  type?: string;
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
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  content: {
    type: String
  },
  navigateToDetailUrl: {
    type: String,
  },
  to: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến model User nếu đây là một User trả lời
    required: true,
  }],
  status: {
    type: String,
    enum: ['DONE' , 'IN_PROCESS', 'DENIED'],
    default: 'IN_PROCESS'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
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