import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingComponent } from '@app/components/loading/loading.component';
import { defaultAvatar, notificationStatus, notificationType } from '@app/constants/common.constant';
import { NotificationRequestBody, NotifyResponse } from '@app/models/notify.model';
import { NotificationService } from '@app/services/notification.service';
import { NotificationSocketService } from '@app/services/sockets/notification-socket.service';
import { UserService } from '@app/services/user.service';
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
  private notificationSocketService: NotificationSocketService = inject(NotificationSocketService);
  private route: Router = inject(Router);
  defaultAvatar = defaultAvatar;
  notifies: NotifyResponse[] = []
  isLoading = signal<boolean>(true);
  notificationType= notificationType;
  notificationStatus = notificationStatus;
 
  getNotification() {
    this.isLoading.update(()=>true);
    const params = {
      idUser: this.userService.currentUserLogin.getValue().id,
      limit: 1000,
      page: 1
    }
    this.notificationService.getAllNotificationToUser(params).subscribe(response => {
      this.isLoading.update(()=>false);
      if (response.statusCode !== 200) return;
      this.notifies = response.data.filter(item=>item.status !== notificationStatus.DENIED).map(item => ({
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
      this.notificationService.updateCountUnReadNotification(this.notifies.filter(item=>!item.isViewed).length);
    })
  }

  ngOnInit(): void {
    this.getNotification();
    this.notificationSocketService.onNotification().subscribe(()=>{
      this.getNotification();
    });

  }
  handleViewNotification(item: NotifyResponse) {
    if(item.type === notificationType.ADD_FRIEND) {
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
      this.notificationService.updateCountUnReadNotification(this.notificationService.getCountNewNotification.getValue() - 1);
      this.route.navigateByUrl(item.navigateToDetailUrl);
    });
  }

  handleDenyClick(item:NotifyResponse) {
    const body: Partial<NotificationRequestBody> = {
      id: item.id,
      status: notificationStatus.DENIED,
      read: [this.userService.currentUserLogin.getValue().id]
    }
    forkJoin([this.userService.denyFriend({id: item.from.id, idFriend: this.userService.currentUserLogin.getValue().id}),this.notificationService.updateNotification(body)]).subscribe(()=>{
      this.notificationSocketService.sendNotification([item.from.id])
      this.getNotification();
    });
  }

  handleAgreeClick(item:NotifyResponse) {
    const body: Partial<NotificationRequestBody> = {
      id: item.id,
      status: notificationStatus.DONE,
      read: [this.userService.currentUserLogin.getValue().id]
    }
    forkJoin([
      this.notificationService.updateNotification(body),
      this.userService.addFriend({
        id: this.userService.currentUserLogin.getValue().id,
        idFriend: item.from.id
      })]).subscribe(()=>{
      this.notificationSocketService.sendNotification([item.from.id])
      this.getNotification();
    });
  }
}
