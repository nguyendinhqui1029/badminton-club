import { PushNotificationPayload } from '../models/push-notification.model';
import env from '../config/env';
import webPush, { SendResult } from 'web-push';
import SocketConnectInformationService from './socket-connect-information.service';
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

  async saveSubscription(idUser: string, subscription: webPush.PushSubscription) {
   const socketConnect = await this.socketConnectInfo.getByIdUser(idUser);
   if(socketConnect) {
    return this.socketConnectInfo.update(idUser, {subscription: subscription});
   }
   return this.socketConnectInfo.create({
    socketId: '',
    idUser: idUser,
    ipAddress: '',
    subscription: subscription});
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
