
import { SocketConnectInformation, Subscriptions } from '../models/socket-connect-information.model';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { NotificationSocketParams } from '../models/notification.model';
import NotificationService from '../services/notification.service';
import { notificationType } from '../constants/common.constants';
export default class NotificationSocket {
  private io: SocketIOServer;
  private notificationService: NotificationService;
  constructor(io: SocketIOServer) {
    this.io = io;
    this.notificationService = new NotificationService();
  }

  notificationSocketListener(socket: Socket, mappingSocketId: Record<string, SocketConnectInformation>) {

    // Notification Event
    socket.on('clientNotificationEvent', (notification: NotificationSocketParams) => {
      // Broadcast the message to all connected clients
      if (!notification.to.length) {
        this.io.emit('serverNotificationEvent', notification.type);
        if(notification.type !== notificationType.RELOAD_DATA) {
          const pushSubscriptions: Subscriptions[] = [];
          Object.values(mappingSocketId).forEach(item=>{
            if(item.subscription) {
              pushSubscriptions.push(item.subscription);
            }
          }); 
          this.notificationService.sendNotification(pushSubscriptions, notification.notifyInfo).then();
        }
        return;
      }
      const pushSubscriptions: Subscriptions[] = [];
      notification.to.forEach(userId=>{
        const socketId = mappingSocketId[userId]?.socketId;
        if(mappingSocketId[userId]?.subscription) {
          pushSubscriptions.push(mappingSocketId[userId].subscription);
        }

        if(socketId) {
          this.io.to(socketId).emit('serverNotificationEvent', notification.type);
        }
      });
      console.log(notification.notifyInfo)
      if(notification.type !== notificationType.RELOAD_DATA) {
        this.notificationService.sendNotification(pushSubscriptions, notification.notifyInfo).then();
      }
    });
  }
}