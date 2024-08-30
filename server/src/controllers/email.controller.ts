import UserModel from '../models/user.model';
import EmailService from '../services/email.service';
import { Request, Response } from 'express';

export default class EmailController {
  public sendCodeResetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const existUser = await UserModel.findOne({email: req.body['to']});
      console.log(existUser)
      if(!existUser) {
         res.status(200).json({
          statusCode: 503,
          statusText: 'Email is not exist',
          totalCount: 0,
          page: 0,
          data: null
        });
        return
      }
      const email = await EmailService.sendEmail(req.body);
      res.status(200).json({
        statusCode: email ? 200 : 400,
        statusText: email ? 'Send email success.' : 'Send email is fail.',
        totalCount: 0,
        page: 0,
        data: email
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Send email error.',
        totalCount: 0,
        page: 0,
        data: error
      });
    }
  };
}