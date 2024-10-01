import mongoose, { Schema, Document } from 'mongoose';
import { getUTCDate } from '../utils/date.util';

export interface SearchUserResponse {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  avatar: string;
}
// Define interface for TypeScript type-checking
export interface User {
  _id?: mongoose.Schema.Types.ObjectId;
  point: number;
  email: string;
  phone: string;
  name: string;
  password: string;
  role: string[];
  avatar: string;
  birthday: Date;
  idFriends: string[];
  idWaitingConfirmAddFriends: string[];
  status: 'ON' | 'OFF';
  gender: 'Male' | 'Female',
  accountType: 'Casual_Player' | 'Fixed_Player',
  createdAt: Date;
  updatedAt: Date;
}

// Define Mongoose schema for User model
const userSchema: Schema = new Schema({
  _id: { type: mongoose.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  point: {
    type: Number,
    default: 0
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6 // Tùy chỉnh độ dài tối thiểu của mật khẩu
  },
  gender: {
    type: String,
    enum: ['Male' , 'Female'], // Định nghĩa các vai trò có thể có
    default: 'Male'
  },
  accountType: {
    type: String,
    enum: ['Casual_Player' , 'Fixed_Player'], // Định nghĩa các vai trò có thể có
    default: 'Fixed_Player'
  },
  role: {
    type: [String],
    enum: ['admin', 'user', 'supperAdmin'], // Định nghĩa các vai trò có thể có
    default: ['user']
  },
  avatar: {
    type: String,
    default: ''
  },
  birthday: {
    type: Date,
    required: true
  },
  idFriends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: []
  }],
  idWaitingConfirmAddFriends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: []
  }],
  status: {
    type: String,
    enum: ['ON', 'OFF'],
    default: 'ON'
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
userSchema.pre('save', function (next) {
  this.updatedAt = getUTCDate(new Date());
  next();
});
// Define and export the User model based on schema
const UserModel = mongoose.model<User>('User', userSchema);

export default UserModel;