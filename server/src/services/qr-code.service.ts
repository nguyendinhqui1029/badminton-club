import QRCode from 'qrcode';
import { Response } from 'express';

export default class QrService {
  public async generateQRCode(id:string): Promise<string | void> {
    const paymentURL = 'https://paymentgateway.example.com/checkout?amount=100&currency=USD&orderId=12345';
    try {
      return await QRCode.toDataURL(paymentURL, {
        type: 'image/webp'
      });
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  }
}
