import mongoose, { Schema, Document } from 'mongoose';

// Define interface for TypeScript type-checking
export interface FileUpload extends Document {
  fileName: string;
  fileSize: number;
  isUse: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define Mongoose schema for User model
const FileUploadSchema: Schema = new Schema({
    fileName: { type: String, required: true, unique: true  },
    fileSize: { type: Number, required: true },
    isUse: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() }
});

// Define and export the User model based on schema
const FileUploadModel = mongoose.model<FileUpload>('file-upload', FileUploadSchema);

export default FileUploadModel;