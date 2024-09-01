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
        title: 'Có bài viết mới!',
        body: 'Nhấp vào đây để xem bài viết mới.',
        icon: '/path/to/icon.png',
        badge: '/path/to/badge.png'
      });
      webPush.sendNotification(subscription, payload);
    }
}
