import PushNotificationService from '../services/push-notification.service';
import { Request, Response } from 'express';
import webPush from 'web-push';

export default class PushNotificationController {
  private pushNotificationService: PushNotificationService;
  private inmemoryDB = [] as webPush.PushSubscription[];

  constructor() {
    this.pushNotificationService = new PushNotificationService();
  }

  sendNotification = async (req: Request, res: Response): Promise<void> => {
    const payload = {
      notification: {
          title: "Angular News",
          body: "Newsletter Available!",
          icon: "assets/images/icon.png",
          vibrate: [100, 50, 100],
          data: {
              dateOfArrival: Date.now(),
              primaryKey: 1
          },
          actions: [{
              action: "explore",
              title: "Go to the site"
          }]
      }
  }
    const promises = [] as any;
    this.inmemoryDB.forEach((subscription: webPush.PushSubscription)=>{
      promises.push(webPush.sendNotification(subscription, JSON.stringify(payload)));
    })
    Promise.all(promises).then(()=>{
      res.status(200).json({ message: 'successful' });
    });
  }

  subscription = async (req: Request, res: Response): Promise<void> => {
    if(this.inmemoryDB.find((item)=>item.endpoint === req.body['endpoint'])) {
      res.status(201).json({ message: 'successful' });
      return;
    }
    this.inmemoryDB.push(req.body);
    res.status(201).json({ message: 'successful' })
  }
}