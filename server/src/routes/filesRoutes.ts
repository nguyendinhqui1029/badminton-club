import FileUploadController from '../controllers/upload-file.controller';
import ValidationService from '../services/validation.service';
import express, { Request, Response } from 'express';
import { body, param } from 'express-validator';
import multer from 'multer';
import path from 'path';
import env from '../config/env';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/images"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname.trim()}`);
  }
});

const upload = multer({ storage });
router.post('/', upload.array('files', 10), [
  body('files').custom((value, { req }) => {
    if (!req.files.length) {
      throw new Error(JSON.stringify({ message: 'File is not empty.', translateKey: 'file_required' }));
    }
    return true;
  })
], ValidationService.handleValidationErrors, async (request: Request, response: Response) => {
  const currentDate = new Date();
  const currentDateUTC = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), 0));
  
  const files = (request?.files as Express.Multer.File[]).map((item: Express.Multer.File)=>({
    name: item.filename,
    type: item.mimetype,
    isUse: false,
    linkCDN: `${env.NODE_ENV === 'DEV' ? `http://${env.DOMAIN}:${env.PORT}/images/${item.filename}` : `${env.DOMAIN}/images/${item.filename}`}`,
    createdAt: currentDateUTC,
    updatedAt: currentDateUTC
  }));
  const fileUploadResult = await FileUploadController.createFileUpload(files);
  response.status(200).send(fileUploadResult);
});

router.delete('/', [param('fileNames').custom((value, { req }) => {
  if (!req.query?.fileNames?.length) {
    throw new Error(JSON.stringify({ message: 'Field fileNames is required.', translateKey: 'fileNames_required' }));
  }
  return true;
})], ValidationService.handleValidationErrors, async (request: Request, response: Response) => {
  const fileNames = eval(request.query['fileNames'] as string);
  const fileUploadResult = await FileUploadController.deleteFileUploadByIds(fileNames);
  response.status(200).send(fileUploadResult);
});

router.put('/', [body('fileNames').custom((value, { req }) => {
  if (!req.body?.fileNames?.length) {
    throw new Error(JSON.stringify({ message: 'Field fileNames is required.', translateKey: 'fileNames_required' }));
  }
  return true;
})], ValidationService.handleValidationErrors, async (request: Request, response: Response) => {
  const fileNames = eval(request.body['fileNames'] as string);
  const isUse = eval(request.body['isUse'] as string);
  const fileUploadResult = await FileUploadController.updateUseFileStatus(fileNames, isUse);
  response.status(200).send(fileUploadResult);
})

router.get('/', async (request: Request, response: Response) => {
  const ids = eval(request.query['ids'] as string);
  const fileUploadResult = await FileUploadController.getFilesByIds(ids);
  response.status(200).send(fileUploadResult);
})
export default router;