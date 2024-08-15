import mongoose, { Schema, Document } from 'mongoose';
import { getUTCDate } from '../utils/date.util';

// Định nghĩa enum cho trạng thái
enum Status {
  OPEN = 'OPEN',
  PENDING = 'PENDING',
  DONE = 'DONE',
  LATE = 'LATE'
}

// Định nghĩa enum cho loại giao dịch
enum TransactionType {
  RECHARGE = 'RECHARGE',
  WITHDRAW = 'WITHDRAW'
}

// Định nghĩa interface cho dữ liệu
export interface Transaction extends Document {
  qrLink: string;       // Liên kết QR dưới dạng chuỗi
  isUser: string;       // Thông tin người dùng dưới dạng chuỗi
  secretKey: string;    // Khóa bí mật dưới dạng chuỗi
  totalAmount: number;  // Tổng số tiền dưới dạng số
  amount: number;       // Số tiền liên quan dưới dạng số
  content: string;      // Nội dung dưới dạng chuỗi
  files: string[];      // Mảng các chuỗi chứa liên kết đến các tệp
  status: Status;       // Trạng thái, sử dụng enum để đảm bảo các giá trị hợp lệ
  type: TransactionType; // Loại giao dịch, sử dụng enum để đảm bảo các giá trị hợp lệ
}

// Định nghĩa schema cho Transaction
const transactionSchema = new mongoose.Schema({
  qrLink: {
    type: String,
    required: true
  },
  isUser: {
    type: String,
    required: true
  },
  secretKey: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  files: {
    type: [String], // Mảng các chuỗi
    default: []
  },
  status: {
    type: String,
    enum: Object.values(Status), // Sử dụng enum để đảm bảo các giá trị hợp lệ
    required: true
  },
  type: {
    type: String,
    enum: Object.values(TransactionType), // Sử dụng enum để đảm bảo các giá trị hợp lệ
    required: true
  }
}, {
  timestamps: true // Tự động thêm createdAt và updatedAt
});

// Tạo model Transaction
const TransactionModel = mongoose.model<Transaction>('Transaction', transactionSchema);

export default TransactionModel;