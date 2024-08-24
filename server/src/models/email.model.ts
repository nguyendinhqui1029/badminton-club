import mongoose, { Schema, Document} from "mongoose";

export interface EmailOptions {
    to: string;
    subject: string;
    cc?: string;
    text: string;
    html?: string;
    status?: 'DRAFT' | 'PENDING' | 'EXPIRED'  | 'ERROR' | 'SUCCESS';
    sendDate: string; // Date as string, could also be Date type
    type: string; // Type of email
    createdAt: Date; // Date type
    updatedAt: Date; // Date type
}

export interface Email extends Document {
    to: string;
    subject: string;
    cc?: string;
    text: string;
    html?: string;
    code?: string;
    status?: 'DRAFT' | 'PENDING' | 'EXPIRED'  | 'ERROR' | 'SUCCESS';
    sendDate: string; // Date as string, could also be Date type
    type: string; // Type of email
    createdAt: Date; // Date type
    updatedAt: Date; // Date type
}

const EmailSchema: Schema = new Schema({
    to: { type: String, required: true },
    subject: { type: String, required: true },
    cc: { type: String },
    code: { type: String },
    text: { type: String, required: true },
    html: { type: String },
    status: { type: String, enum: ['DRAFT', 'PENDING', 'ERROR', 'SUCCESS'], default: 'DRAFT' },
    sendDate: { type: Date, required: true }, // Sử dụng Date type cho sendDate
    type: { type: String, required: true },
  }, 
  {
    timestamps: true // Tự động tạo createdAt và updatedAt
  });
  
  // Tạo model
  const EmailModel = mongoose.model<Email>('Email', EmailSchema);
  
  export default EmailModel;