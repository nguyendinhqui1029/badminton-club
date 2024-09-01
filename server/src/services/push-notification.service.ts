import { PushNotificationPayload } from '../models/push-notification.model';
import env from '../config/env';
import webPush from 'web-push';
export default class PushNotificationService {
    private vapidKeys: {
      publicKey: string,
      privateKey: string
    } = {
      publicKey:env.WEB_PUSH_PUBLIC_KEY,
      privateKey: env.WEB_PUSH_PRIVATE_KEY
    };
    constructor() {
      webPush.setVapidDetails(
        'mailto:example@yourdomain.org',
        this.vapidKeys.publicKey,
        this.vapidKeys.privateKey
      );
    }

    sendNotification = (subscription: webPush.PushSubscription)=>{
      const payload = JSON.stringify({
        title: 'Test Notification',
        body: 'This is a test notification'
      });
      webPush.sendNotification(subscription, payload)
      .then(response => console.log('Notification sent:', response))
      .catch(error => console.error('Error sending notification:', error));
    }
}
