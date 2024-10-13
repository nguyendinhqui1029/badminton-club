
import mongoose from 'mongoose';
import NotificationModel, { Notification, FetchNotificationToUserRequestParams, NotificationToUserResponse, NotificationClientPayload } from '../models/notification.model';
import { SearchUserResponse } from '../models/user.model';
import { notificationStatus } from '../constants/common.constants';
import env from '../config/env';
import SocketConnectInformationService from './socket-connect-information.service';
import webPush, { PushSubscription, SendResult } from 'web-push';
import { SocketConnectInformation } from '../models/socket-connect-information.model';
import UserService from './user.service';

class NotificationService {
  private socketConnectInfo: SocketConnectInformationService;
  private vapidKeys: {
    publicKey: string,
    privateKey: string
  } = {
      publicKey: env.WEB_PUSH_PUBLIC_KEY,
      privateKey: env.WEB_PUSH_PRIVATE_KEY
    };

  // Push notification 
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

  sendNotification = async (pushSubscriptions: PushSubscription[], notification: NotificationClientPayload) => {
    const payload = JSON.stringify({
      notification: {
        title: notification.title,
        body: notification.content || '',
        actions: [
          {
            action: 'default',
            title: 'Mặc định'
          }
        ],
        data: {
          onActionClick: {
            default: {
              operation: 'navigateLastFocusedOrOpen',
              url: notification.navigateToDetailUrl
            }
          },
          notificationId: notification.id,
          type: notification.type
        }
      }
    });
    const notificationPromise: Promise<SendResult>[] = [];
    pushSubscriptions.forEach(subscription => {
      notificationPromise.push(webPush.sendNotification(subscription, payload));
    })
    return Promise.all(notificationPromise);
  }

  // End Push notification
  public async getNotificationFromUser(params: FetchNotificationToUserRequestParams): Promise<NotificationToUserResponse[]> {
    const limit = params.limit || 10000;
    const skip = params.page ? (params.page - 1) * params.limit : 0;
    const query = {
      fromUser: new mongoose.Types.ObjectId(params.idUser),
      ...(params.status && { status: params.status }),
      ...(params.type && { type: params.type })
    };
    const result = await NotificationModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('fromUser', '_id name avatar');
    if (!result.length) {
      return [];
    }
    return result.map((item: Notification) => ({
      _id: new mongoose.Types.ObjectId(item._id),
      content: item.content,
      fromUser: item.fromUser ? { _id: (item.fromUser as SearchUserResponse)._id, avatar: (item.fromUser as SearchUserResponse).avatar, name: (item.fromUser as SearchUserResponse).name } : null,
      navigateToDetailUrl: item.navigateToDetailUrl || '',
      isRead: item.read.includes(new mongoose.Types.ObjectId(params.idUser)),
      read: item.read,
      createdAt: item.createdAt,
      title: item.title,
      to: item.to,
      type: item.type,
      status: item.status
    }));
  }

  public async getNotificationToUser(params: FetchNotificationToUserRequestParams): Promise<NotificationToUserResponse[]> {
    const limit = params.limit || 10000;
    const skip = params.page ? (params.page - 1) * params.limit : 0;
    const query = {
      to: new mongoose.Types.ObjectId(params.idUser),
      ...(params.status && { status: params.status }),
      ...(params.type && { type: params.type })
    };
    const result = await NotificationModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('fromUser', '_id name avatar');
    if (!result.length) {
      return [];
    }
    return result.map((item: Notification) => ({
      _id: new mongoose.Types.ObjectId(item._id),
      content: item.content,
      fromUser: item.fromUser ? { _id: (item.fromUser as SearchUserResponse)._id, avatar: (item.fromUser as SearchUserResponse).avatar, name: (item.fromUser as SearchUserResponse).name } : null,
      navigateToDetailUrl: item.navigateToDetailUrl || '',
      isRead: item.read.includes(new mongoose.Types.ObjectId(params.idUser)),
      read: item.read,
      createdAt: item.createdAt,
      title: item.title,
      to: item.to,
      type: item.type,
      status: item.status
    }));
  }

  public async create(notification: Notification): Promise<Notification> {
    notification.to.forEach(item=>{
      if(item._id && item._id.toString() !== notification.fromUser?.toString()) {
        notification.to.push(item._id);
      }
    });
    return await NotificationModel.create(notification);
  }

  public async update(id: string, notification: Notification): Promise<Notification | null> {
    if (notification?.read?.length === notification?.to?.length) {
      notification.status = notificationStatus.DONE;
    }
    return await NotificationModel.findByIdAndUpdate(id, { $set: notification }, { new: true });
  }
}

export default NotificationService;