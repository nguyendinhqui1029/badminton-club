import { ApiResponseValue, ErrorResponse } from '../models/response-value.model';
import FileUploadModel, { FileUpload } from '../models/file.model';
import { promises as fs } from 'fs';
import path from 'path';

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


  public static deleteFileUploadByIds = async (ids: string[]): Promise<ApiResponseValue<FileUpload[] | ErrorResponse[]>> => {
    try {
      const deletedDocuments = await FileUploadModel.find({ _id: { $in: ids } });
      const files: FileUpload[] = [];
      for (let index = 0; index < deletedDocuments.length; index++) {
        try {
          await fs.unlink(`${path.join(__dirname, "../../public/images")}/${deletedDocuments[index].fileName}`);
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

  public static updateUseFileStatus = async (ids: string[], isUse: boolean): Promise<ApiResponseValue<ErrorResponse[]>> => {
    try {
      const currentDate = new Date();
      const currentDateUTC = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), 0))
      await FileUploadModel.updateMany({ _id: { $in: ids } }, {
        $set: { isUse: isUse, updatedAt: currentDateUTC }
      });
      return ({
        statusCode: 200,
        statusText: 'File update is successful.',
        totalCount: 0,
        page: 0,
        data: null
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

  public static getFilesByFileName = async (names: string[]): Promise<ApiResponseValue<FileUpload[] | ErrorResponse[]>> => {
    try {
      const files = await FileUploadModel.find({ fileName: { $in: names } });
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
          data: [{ message: 'Server error', translateKey: 'server_error' }]
        });
      });
    }
  };
}
