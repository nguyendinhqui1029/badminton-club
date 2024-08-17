import mongoose, { Schema, Document } from 'mongoose';

// Define interface for TypeScript type-checking
export interface FileUpload {
  name: string;
  type: string;
  isUse: boolean;
  linkCDN: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define Mongoose schema for User model
const FileUploadSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true  },
  type: { type: String, required: true },
  linkCDN: { type: String, required: true },
  isUse: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() }
});

// Define and export the User model based on schema
const FileUploadModel = mongoose.model<FileUpload & Document>('file-upload', FileUploadSchema);

export default FileUploadModel;