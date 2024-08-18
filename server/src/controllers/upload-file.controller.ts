import { ApiResponseValue, ErrorResponse } from '../models/response-value.model';
import FileUploadModel, { FileUpload } from '../models/file.model';
import { promises as fs } from 'fs';
import path from 'path';
import mongoose from 'mongoose';

export default class FileUploadController {

  public static createFileUpload = async (fileUpload: FileUpload[]): Promise<ApiResponseValue<FileUpload[] | ErrorResponse[]>> => {
    try {
      return FileUploadModel.insertMany(fileUpload).then((value: FileUpload[]) => ({
        statusCode: 200,
        statusText: 'File upload is successful.',
        totalCount: 0,
        page: 0,
        data: value
      }));
    } catch (error) {
      return new Promise((resolve) => {
        resolve({
          statusCode: 400,
          statusText: 'Request body is incorrect.',
          totalCount: 0,
          page: 0,
          data: [{ message: 'Server error', translateKey: 'server_error' }]
        });
      });
    }
  };


  public static deleteFileUploadByIds = async (fileNames: string[]): Promise<ApiResponseValue<FileUpload[] | ErrorResponse[]>> => {
    try {
     
      const deletedDocuments = await FileUploadModel.find({ name: { $in: fileNames } });
      const files: FileUpload[] = [];
      for (let index = 0; index < deletedDocuments.length; index++) {
        try {
          await fs.unlink(`${path.join(__dirname, "../../public/images")}/${deletedDocuments[index].name}`);
          const documentDelete = await FileUploadModel.deleteOne({ _id: deletedDocuments[index]._id });
          if (!!documentDelete?.deletedCount) {
            files.push(deletedDocuments[index]);
          }
        } catch {
          console.log('Error: Can\'t not find')
        }
      }
      return ({
        statusCode: files.length ? 200 : 400,
        statusText: files.length ? 'File delete is successful.' : 'File delete is failed',
        totalCount: 0,
        page: 0,
        data: files
      });
    } catch (error) {
      return new Promise((resolve) => {
        resolve({
          statusCode: 400,
          statusText: 'Something is wrong.',
          totalCount: 0,
          page: 0,
          data: [{ message: 'Server error', translateKey: 'server_error' }]
        });
      });
    }
  };

  public static updateUseFileStatus = async (fileNames: string[], isUse: boolean): Promise<ApiResponseValue<number | ErrorResponse[]>> => {
    try {
      const currentDate = new Date();
      const currentDateUTC = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), 0))
      const result = await FileUploadModel.updateMany({ name: { $in: fileNames } }, {
        $set: { isUse: isUse, updatedAt: currentDateUTC }
      }, {new: true});
      return ({
        statusCode: 200,
        statusText: 'File update is successful.',
        totalCount: 0,
        page: 0,
        data: result.modifiedCount
      });
    } catch (error) {
      return new Promise((resolve) => {
        resolve({
          statusCode: 400,
          statusText: 'Something is wrong.',
          totalCount: 0,
          page: 0,
          data: [{ message: 'Server error', translateKey: 'server_error' }]
        });
      });
    }
  };

  public static getFilesByIds = async (ids: string[]): Promise<ApiResponseValue<FileUpload[] | ErrorResponse[]>> => {
    try {
      const objectIds = ids.map((id: string) => new mongoose.Types.ObjectId(id));
      const files = await FileUploadModel.find({ _id: { $in: objectIds } });
      return ({
        statusCode: 200,
        statusText: 'Get file is successful.',
        totalCount: 0,
        page: 0,
        data: files
      });
    } catch (error) {
      return new Promise((resolve) => {
        resolve({
          statusCode: 400,
          statusText: 'Something is wrong.',
          totalCount: 0,
          page: 0,
          data: [{ message: JSON.stringify(error), translateKey: 'server_error' }]
        });
      });
    }
  };
}
