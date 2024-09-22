import mongoose, { Schema, Document } from 'mongoose';
import { getUTCDate } from '../utils/date.util';

// Define interface for TypeScript type-checking
export interface Post extends Document {
  images: string[];
  background: string;
  content: string;
  idUserLike: string[];
  countComment: number;
  shareLink: string[];
  hashTag: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tagFriends: string[];
  tagLocation: string;
  feelingIcon: string;
  scope: 'Everyone' | 'Only_Me' | 'Friends';
}


const postSchema = new mongoose.Schema({
  images: {
    type: [String],
    default: []
  },
  background: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  idUserLike: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến model User
    default: []
  }],
  countComment: {
    type: Number,
    default: 0
  },
  tagFriends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến model User
    default: []
  }],
  tagLocation: {
    type: String,
    trim: true
  },
  feelingIcon: {
    type: String,
    trim: true
  },
  shareLink: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến model User
    default: []
  }],
  hashTag: {
    type: [String],
    default: []
  },
  scope: {
    type: String,
    enum: ['Everyone', 'Only_Me', 'Friends'],
    default: 'Everyone'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
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
postSchema.pre('save', function(next) {
  this.updatedAt = getUTCDate(new Date());
  next();
});

// Tạo model Post
const PostModel = mongoose.model<Post>('Post', postSchema);

export default PostModel;