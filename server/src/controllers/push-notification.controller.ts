import PushNotificationService from '../services/push-notification.service';
import { Request, Response } from 'express';
import webPush from 'web-push';

export default class PushNotificationController {
  private pushNotificationService: PushNotificationService;

  constructor() {
    this.pushNotificationService = new PushNotificationService();
  }

  sendNotification = async (req: Request, res: Response): Promise<void> => {
    const ids = req.body['ids'];
    const body = req.body['body'];
    this.pushNotificationService.sendNotification(ids,body).then((result)=>{
      res.status(200).json({
        statusCode: 200,
        statusText: 'Send notification success',
        totalCount: 0,
        page: 0,
        data: result 
      });
    }).catch((error)=>{

      res.status(200).json({
        statusCode: 500,
        statusText: 'Send notification error',
        totalCount: 0,
        page: 0,
        data: error 
      });
    });
  }

  subscription = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = {
        socketId: req.body['socketId'],
        idUser: req.body['idUser'],
        subscription: req.body['subscription']
      };
      const saveSubscriptionResult = this.pushNotificationService.saveSubscription(body);
  
      res.status(200).json({
        statusCode: 200,
        statusText: 'Get saveSubscriptionResult is successful.',
        totalCount: 0,
        page: 0,
        data: saveSubscriptionResult 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Get saveSubscriptionResult is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
   
  }
}