import mongoose, { Schema, Document } from 'mongoose';
import { getUTCDate } from '../utils/date.util';

export interface SearchUserResponse {
  name: string;
  avatar: string;
}
// Define interface for TypeScript type-checking
export interface User extends Document {
  point: number;
  email: string;
  phone: string;
  name: string;
  password: string;
  role: string[];
  avatar: string;
  birthday: Date;
  idFriends: string[];
  status: 'BLOCK' | 'WAITING' | 'ON' | 'OFF';
  createdAt: Date;
  updatedAt: Date;
}

// Define Mongoose schema for User model
const userSchema: Schema = new Schema({
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
  role: {
    type: [String],
    enum: ['admin', 'user', 'moderator'], // Định nghĩa các vai trò có thể có
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
  }],
  status: {
    type: String,
    enum: ['BLOCK', 'WAITING', 'ON', 'OFF'],
    default: 'WAITING'
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
userSchema.pre('save', function(next) {
  this.updatedAt = getUTCDate(new Date());
  next();
});
// Define and export the User model based on schema
const UserModel = mongoose.model<User>('User', userSchema);

export default UserModel;