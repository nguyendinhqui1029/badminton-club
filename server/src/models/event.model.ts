import mongoose, { Schema, Document } from 'mongoose';

export interface Event extends Document {
  name: string;            
  type: string;            
  address: string;         
  expectedBudget: string;  
  startDate: string;       
  endDate: string;         // Ngày kết thúc sự kiện (định dạng chuỗi, ví dụ: "2024-08-16")
  description: string;     // Mô tả sự kiện
  thumbnail: string; 
  toUser: string[];
  status: 'ON' | 'EXPIRED' | 'WAITING' | 'OFF'; // Trạng thái của sự kiện
}

const eventSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  expectedBudget: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
    // Bạn có thể thêm validate để đảm bảo định dạng ISO 8601 nếu cần
  },
  endDate: {
    type: String,
    required: true,
    // Bạn có thể thêm validate để đảm bảo định dạng ISO 8601 nếu cần
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  toUser: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến model User
    default: []
  }],
  status: {
    type: String,
    enum: ['ON', 'EXPIRED', 'WAITING', 'OFF'], // Các giá trị hợp lệ cho status
    required: true,
    default: 'OFF'
  }
}, {
  timestamps: true, // Thêm createdAt và updatedAt
});

// Tạo mô hình Event
const EventModel = mongoose.model<Event>('Event', eventSchema);

export default EventModel;
