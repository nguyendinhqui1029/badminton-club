import { generateUniqueRandomString } from '../utils/common.util';
import EmailModel, { Email, EmailOptions } from '../models/email.model';
import nodemailer from 'nodemailer';

export default class EmailService {
  static transporter = nodemailer.createTransport({
    service: 'gmail', // Example with Gmail; use appropriate service or SMTP server
    port: 25,
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
  });

  static async sendEmail(options: EmailOptions): Promise<Email | null> {
    try {
      const code =  generateUniqueRandomString(6);
      const html = options.html?.replace('{code}',code);
      const info = await EmailService.transporter.sendMail({
        from: `"Smilegate Badminton Club Bot" ${process.env.EMAIL_USER}`, // Sender address
        to: options.to, // Recipient address
        cc: options.cc,
        subject: options.subject, // Subject line
        text: options.text, // Plain text body
        html: html,// HTML body (optional)
      });
      
      if(!info.messageId) {
        return null;
      }

      const email = await EmailModel.create({
        ...options,
        html: options.html?.replace('{code}',code),
        code: code,
        status: 'SUCCESS', 
        sendDate: new Date().toISOString(), 
      });
      return email;
    } catch (error: any) {
    return null; 
    }
  }

  static async sendVerifyCodeByEmailTo(email: string, code: string): Promise<Email | null> {
    try {
      const now = new Date();
      const past300Seconds = new Date(now.getTime() - 2*60 * 1000);
      const result= await EmailModel.findOne({ 
        to: email, 
        code: code, 
        createdAt: { $gte: past300Seconds }})
      .sort({ createdAt: -1 })
      .exec();
      console.log(result)
      return result;
    } catch (error: any) {
     return null; 
    }
  }

  static async deleteEmailById(id: string): Promise<Email | null> {
    try {
      return await EmailModel.findByIdAndDelete(id, { new: true });
    } catch (error: any) {
    return null; 
    }
  }
}


