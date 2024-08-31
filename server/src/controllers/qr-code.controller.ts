import QrService from '../services/qr-code.service';
import { Request, Response } from 'express';

export default class QrCodeController {
  private qrService: QrService;

  constructor() {
    this.qrService = new QrService();
  }

  public getByPaymentId = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.qrService.generateQRCode(req.params['id']);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Generate QR Code is failed.',
        totalCount: 0,
        page: 0,
        data: result
      })
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Generate QR Code is failed.',
        totalCount: 0,
        page: 0,
        data: error
      });
    }
  };
}