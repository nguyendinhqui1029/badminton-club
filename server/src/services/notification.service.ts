
import mongoose from 'mongoose';
import NotificationModel, {Notification, FetchNotificationToUserRequestParams, NotificationToUserResponse } from '../models/notification.model';
import { SearchUserResponse } from '../models/user.model';

class NotificationService {
  public async getNotificationFromUser(params: FetchNotificationToUserRequestParams): Promise<NotificationToUserResponse[]> {
    const limit = params.limit || 10000;
    const skip = params.page ? (params.page - 1) * params.limit : 0;
    const query = {
      fromUser: new mongoose.Types.ObjectId(params.idUser),
      ...(params.status && {status: params.status}),
    ...(params.type && {type: params.type})};
    const result =  await NotificationModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('fromUser', '_id name avatar');
    if(!result.length) {
      return [];
    }
    return result.map((item: Notification)=>({
      _id: new mongoose.Types.ObjectId(item._id),
      content: item.content,
      fromUser: item.fromUser ? {_id: (item.fromUser as SearchUserResponse)._id, avatar: (item.fromUser as SearchUserResponse).avatar, name: (item.fromUser as SearchUserResponse).name} : null,
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
      ...(params.status && {status: params.status}),
    ...(params.type && {type: params.type})};
    const result =  await NotificationModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('fromUser', '_id name avatar');
    if(!result.length) {
      return [];
    }
    return result.map((item: Notification)=>({
      _id: new mongoose.Types.ObjectId(item._id),
      content: item.content,
      fromUser: item.fromUser ? {_id: (item.fromUser as SearchUserResponse)._id, avatar: (item.fromUser as SearchUserResponse).avatar, name: (item.fromUser as SearchUserResponse).name} : null,
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
    return await NotificationModel.create(notification);
  }

  public async update(id: string, notification: Notification): Promise<Notification | null> {
    return await NotificationModel.findByIdAndUpdate(id, {$set: notification}, { new: true });
  }
}

export default NotificationService;