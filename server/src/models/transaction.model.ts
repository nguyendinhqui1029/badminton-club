import mongoose, { Schema, Document } from 'mongoose';

// Định nghĩa enum cho trạng thái
enum Status {
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
  idUser: string;       // Thông tin người dùng dưới dạng chuỗi
  amount: number; 
  title: string;      // Số tiền liên quan dưới dạng số
  content: string;      // Nội dung dưới dạng chuỗi
  files: string[];      // Mảng các chuỗi chứa liên kết đến các tệp
  status: Status;       // Trạng thái, sử dụng enum để đảm bảo các giá trị hợp lệ
  type: TransactionType; // Loại giao dịch, sử dụng enum để đảm bảo các giá trị hợp lệ
  createdBy: string;
}

// Định nghĩa schema cho Transaction
const transactionSchema = new mongoose.Schema({
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến model User nếu đây là một User trả lời
    required: true,
  },
  amount: {
    type: Number,
    required: true
  },
  title: {
    type: String,
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
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến model User nếu đây là một User trả lời
    required: true,
  }
}, {
  timestamps: true // Tự động thêm createdAt và updatedAt
});

// Tạo model Transaction
const TransactionModel = mongoose.model<Transaction>('Transaction', transactionSchema);

export default TransactionModel;