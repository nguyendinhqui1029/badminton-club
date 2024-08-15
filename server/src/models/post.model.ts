import mongoose, { Schema, Document } from 'mongoose';
import { getUTCDate } from '../utils/date.util';

// Define interface for TypeScript type-checking
export interface Post extends Document {
  images: string[];
  background: string;
  content: string;
  idUserLike: string[];
  idComment: string[];
  shareLink: string;
  hashTag: string[];
  createdAt: string;
  updatedAt: string;
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
  idUserLike: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User', // Tham chiếu đến model User
    default: []
  },
  idComment: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Comment', // Tham chiếu đến model Comment
    default: []
  },
  shareLink: {
    type: String,
    default: ''
  },
  hashTag: {
    type: [String],
    default: []
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
postSchema.pre('save', function(next) {
  this.updatedAt = getUTCDate(new Date());
  next();
});

// Tạo model Post
const Post = mongoose.model('Post', postSchema);

module.exports = Post;