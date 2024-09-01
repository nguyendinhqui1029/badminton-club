import PushNotificationService from '../services/push-notification.service';
import { Request, Response } from 'express';

export default class PushNotificationController {
  private pushNotificationService: PushNotificationService;

  constructor() {
    this.pushNotificationService = new PushNotificationService();
  }

  sendNotification = async (req: Request, res: Response): Promise<void> => {
    const subscription = req.body.subscription;
    this.pushNotificationService.sendNotification(subscription);
  }
}