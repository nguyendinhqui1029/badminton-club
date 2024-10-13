import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingComponent } from '@app/components/loading/loading.component';
import { defaultAvatar, notificationStatus, notificationType } from '@app/constants/common.constant';
import { NotificationRequestBody, NotificationSocketParams, NotifyResponse } from '@app/models/notify.model';
import { NotificationService } from '@app/services/notification.service';
import { UserService } from '@app/services/user.service';
import { NotificationSocket } from '@app/sockets/notification.socket';
import { ButtonModule } from 'primeng/button';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-notify',
  standalone: true,
  imports: [DatePipe, LoadingComponent, ButtonModule],
  templateUrl: './notify.component.html',
  styleUrl: './notify.component.scss'
})
export class NotifyComponent implements OnInit {

  private notificationService: NotificationService = inject(NotificationService);
  private userService: UserService = inject(UserService);
  private notificationSocket: NotificationSocket = inject(NotificationSocket);
  private route: Router = inject(Router);
  defaultAvatar = defaultAvatar;
  notifies: NotifyResponse[] = []
  notificationType= notificationType;
  notificationStatus = notificationStatus;

  ngOnInit(): void {
    this.notificationService.getNewNotification.subscribe(newNotification => {
      this.notifies = newNotification.filter(item=>item.status !== notificationStatus.DENIED).map(item => ({
        id: item.id!,
        isViewed: item.isRead,
        content: item.content,
        title: item.title,
        read: item.read,
        from: {
          id: item.fromUser?.id || '',
          avatar: item.fromUser?.avatar || '',
          name: item.fromUser?.name || ''
        } || null,
        createdAt: item.createdAt,
        navigateToDetailUrl: item.navigateToDetailUrl,
        type: item.type,
        status: item.status
      }));
    });
  }
  handleViewNotification(item: NotifyResponse) {
    if([notificationType.ADD_FRIEND, notificationType.UN_FRIEND].includes(item.type)) {
      return;
    }
    if(item.isViewed) {
      this.route.navigateByUrl(item.navigateToDetailUrl);
      return;
    }
    const body: Partial<NotificationRequestBody> = {
      id: item.id,
      read: [...item.read,this.userService.currentUserLogin.getValue().id]
    }
    this.notificationService.updateNotification(body).subscribe(response=>{
      if(response.statusCode !== 200) return;
      const params: NotificationSocketParams = {
        to: [this.userService.currentUserLogin.getValue().id],
        type: notificationType.RELOAD_DATA,
        notifyInfo: null
      }
      this.notificationSocket.sendNotificationEvent(params);
      this.route.navigateByUrl(item.navigateToDetailUrl);
    });
  }

  handleDenyClick(item:NotifyResponse) {
    const body: Partial<NotificationRequestBody> = {
      id: item.id,
      status: notificationStatus.DENIED,
      read: [this.userService.currentUserLogin.getValue().id]
    }
    forkJoin([
      this.userService.denyFriend({id: item.from.id, idFriend: this.userService.currentUserLogin.getValue().id}),
      this.notificationService.updateNotification(body)]).subscribe(()=>{
      const params: NotificationSocketParams = {
        to: [item.from.id, this.userService.currentUserLogin.getValue().id],
        type: notificationType.RELOAD_DATA,
        notifyInfo: null
      }
      this.notificationSocket.sendNotificationEvent(params);
    });
  }

  handleAgreeClick(item:NotifyResponse) {
    const body: Partial<NotificationRequestBody> = {
      id: item.id,
      title: `Bạn và ${item.from.name} đã trở thành bạn bè.`,
      status: notificationStatus.DONE,
      read: [this.userService.currentUserLogin.getValue().id]
    }
    forkJoin([
      this.notificationService.updateNotification(body),
      this.userService.addFriend({
        id: this.userService.currentUserLogin.getValue().id,
        idFriend: item.from.id
      })]).subscribe(([notificationResponse,_])=>{
      const params: NotificationSocketParams = {
        to: [item.from.id],
        type: notificationType.ADD_FRIEND,
        notifyInfo: notificationResponse.data
      }
      this.notificationSocket.sendNotificationEvent(params);

      // Update notification list
      const paramsReloadNewData: NotificationSocketParams = {
        to: [this.userService.currentUserLogin.getValue().id],
        type: notificationType.RELOAD_DATA,
        notifyInfo: null
      }
      this.notificationSocket.sendNotificationEvent(paramsReloadNewData);
    });
  }

  handleAddFriendClick(item:NotifyResponse) {
    const userInfo = this.userService.currentUserLogin.getValue();
    forkJoin([this.notificationService.updateNotification({
      id: item.id,
      read: [],
      title: `${userInfo.name} đã gửi lời mời kết bạn đến bạn.`,
      content: '',
      fromUser: userInfo.id,
      navigateToDetailUrl: '',
      to: [item.from.id],
      type: notificationType.ADD_FRIEND,
      status: notificationStatus.IN_PROCESS
    }), this.userService.addFriend({
      id: userInfo.id,
      idFriendWaiting: item.from.id
    })]).subscribe(([notifyResponse, _])=>{
      const params: NotificationSocketParams = {
        to: [item.from.id],
        type: notificationType.ADD_FRIEND,
        notifyInfo: notifyResponse.data
      };
      this.notificationSocket.sendNotificationEvent(params);

      // Update notification list
      const paramsReloadNewData: NotificationSocketParams = {
        to: [this.userService.currentUserLogin.getValue().id],
        type: notificationType.RELOAD_DATA,
        notifyInfo: null
      }
      this.notificationSocket.sendNotificationEvent(paramsReloadNewData);
    });
  }

  handleIgnoreClick(item:NotifyResponse) {
    const body: Partial<NotificationRequestBody> = {
      id: item.id,
      title: `Bạn và ${item.from.name} đã huỷ kết bạn nhau.`,
      read: [...item.read,this.userService.currentUserLogin.getValue().id],
      status: notificationStatus.DONE
    }
    this.notificationService.updateNotification(body).subscribe(response=>{
      if(response.statusCode !== 200) return;
      const params: NotificationSocketParams = {
        to: [this.userService.currentUserLogin.getValue().id],
        type: notificationType.RELOAD_DATA,
        notifyInfo: null
      }
      this.notificationSocket.sendNotificationEvent(params);
    });
  }
}
