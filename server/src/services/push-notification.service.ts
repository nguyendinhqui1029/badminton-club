import { PushNotificationPayload } from '../models/push-notification.model';
import env from '../config/env';
import webPush, { SendResult } from 'web-push';
import SocketConnectInformationService from './socket-connect-information.service';
import { SocketConnectInformation } from '../models/socket-connect-information.model';
export default class PushNotificationService {
  private vapidKeys: {
    publicKey: string,
    privateKey: string
  } = {
      publicKey: env.WEB_PUSH_PUBLIC_KEY,
      privateKey: env.WEB_PUSH_PRIVATE_KEY
    };

  private socketConnectInfo: SocketConnectInformationService;
  constructor() {
    webPush.setVapidDetails(
      'mailto:nguyendinhqui1029@gmail.com',
      this.vapidKeys.publicKey,
      this.vapidKeys.privateKey
    );
    this.socketConnectInfo = new SocketConnectInformationService();
  }

  async saveSubscription(body: SocketConnectInformation) {
   return this.socketConnectInfo.create(body);
  }

  sendNotification = async (ids: string[], body: PushNotificationPayload) => {
    const socketInfoList = await this.socketConnectInfo.getByMultipleIdUser(ids);
    const payload = JSON.stringify(body);
    const notificationPromise: Promise<SendResult>[] = [];
    socketInfoList.forEach(item=>{
      if(item.subscription) {
        notificationPromise.push(webPush.sendNotification(item.subscription, payload));
      }
    })
    return Promise.all(notificationPromise);
  }
}
