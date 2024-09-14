import { getUTCDate } from '../utils/date.util';
import mongoose, { Schema, Document } from 'mongoose';

// Define interface for TypeScript type-checking
export interface Comment extends Document{
  content: string;
  status: string;
  idRootComment: string;
  createdAt: string;
  updatedAt: string;
  idUser: string;
  images: string[];
  idPost: string;
}

const commentSchema = new mongoose.Schema({
  idPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', // Tham chiếu đến model User nếu đây là một User trả lời
    required: true,
  },
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến model User nếu đây là một User trả lời
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'], // Giả sử có các trạng thái này
    default: 'PENDING'
  },
  idRootComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment', // Tham chiếu đến model Comment nếu đây là một comment trả lời
    default: null
  },
  images: [{
    type: String,
    required: true,
    trim: true
  }],
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
commentSchema.pre('save', function(next) {
  this.updatedAt = getUTCDate(new Date());
  next();
});

// Tạo model Comment
const CommentModel = mongoose.model<Comment>('Comment', commentSchema);

export default CommentModel;