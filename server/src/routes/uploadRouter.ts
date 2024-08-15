import FileUploadController from '../controllers/upload-file.controller';
import ValidationService from '../services/validation.service';
import express, { Request, Response } from 'express';
import { body, param } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { FileUpload } from '../models/file.model';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/images"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });
router.post('/', upload.array('files', 10), [
  body('files').custom((value, { req }) => {
    if (!req.files.length) {
      throw new Error(JSON.stringify({ message: 'File is not empty.', translateKey: 'file_required' }));
    }
    return true;
  }),
  body('fileType').custom((value, { req }) => {
    if (!value) {
      throw new Error(JSON.stringify({ message: 'File type is not empty.', translateKey: 'file_type_required' }));
    }
    const hasErrorFileType = req.files.find((item: Express.Multer.File) => {
      return value !==  'image/*' && !value.replace(/\s/g, '').split(',').includes(item.originalname.substring(item.originalname.lastIndexOf('.')));
    });
    if (hasErrorFileType) {
      throw new Error(JSON.stringify({ message: 'File type is not allow.', translateKey: 'file_type_not_allow' }));
    }
    return true;
  }),
], ValidationService.handleValidationErrors, async (request: Request, response: Response) => {
  const currentDate = new Date();
  const currentDateUTC = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), 0))
  const files = (request?.files as Express.Multer.File[]).map((item: Express.Multer.File)=>({
    fileName: item.filename,
    fileSize: item.size,
    isUse: false,
    createdAt: currentDateUTC,
    updatedAt: currentDateUTC
  } as FileUpload));
  const fileUploadResult = await FileUploadController.createFileUpload(files);
  response.status(200).send(fileUploadResult);
});

router.delete('/', [param('ids').custom((value, { req }) => {
  if (!req.query?.ids?.length) {
    throw new Error(JSON.stringify({ message: 'Field ids is required.', translateKey: 'ids_required' }));
  }
  return true;
})], ValidationService.handleValidationErrors, async (request: Request, response: Response) => {
  const ids = eval(request.query['ids'] as string);
  const fileUploadResult = await FileUploadController.deleteFileUploadByIds(ids);
  response.status(200).send(fileUploadResult);
});

router.put('/', [body('ids').custom((value, { req }) => {
  if (!req?.ids?.length) {
    throw new Error(JSON.stringify({ message: 'Field ids is required.', translateKey: 'ids_required' }));
  }
  return true;
}),
body('isUse').custom((value, { req }) => {
  if (req?.isUse !== null || req?.isUse !== undefined) {
    throw new Error(JSON.stringify({ message: 'Field isUse is required.', translateKey: 'is_use_required' }));
  }
  return true;
})], ValidationService.handleValidationErrors, async (request: Request, response: Response) => {
  const ids = eval(request.body['ids'] as string);
  const isUse = eval(request.body['isUse'] as string);
  const fileUploadResult = await FileUploadController.updateUseFileStatus(ids, isUse);
  response.status(200).send(fileUploadResult);
})

router.get('/', [param('names').custom((value, { req }) => {
  if (!req.query?.names?.length) {
    throw new Error(JSON.stringify({ message: 'Field names is required.', translateKey: 'names_required' }));
  }
  return true;
})], ValidationService.handleValidationErrors, async (request: Request, response: Response) => {
  const names = eval(request.query['names'] as string);
  const fileUploadResult = await FileUploadController.getFilesByFileName(names);
  response.status(200).send(fileUploadResult);
})
export default router;