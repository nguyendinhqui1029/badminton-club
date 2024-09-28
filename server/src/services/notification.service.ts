
import mongoose from 'mongoose';
import NotificationModel, {Notification, FetchNotificationToUserRequestParams, NotificationToUserResponse } from '../models/notification.model';
import { SearchUserResponse } from '../models/user.model';

class NotificationService {
  public async getNotificationToUser(params: FetchNotificationToUserRequestParams): Promise<NotificationToUserResponse[]> {
    const limit = params.limit || 10000;
    const skip = params.page ? (params.page - 1) * params.limit : 0;
    const result =  await NotificationModel.find({
      to: params.idUser,
      status: params.status || 'IN_PROCESS'
    }).skip(skip).limit(limit).populate('fromUser', '_id name avatar');
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
      createdAt: item.createdAt
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