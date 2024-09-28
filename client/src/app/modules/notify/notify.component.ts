import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingComponent } from '@app/components/loading/loading.component';
import { defaultAvatar } from '@app/constants/common.constant';
import { NotificationRequestBody, NotifyResponse } from '@app/models/notify.model';
import { NotificationService } from '@app/services/notification.service';
import { SocketService } from '@app/services/socket.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-notify',
  standalone: true,
  imports: [DatePipe, LoadingComponent],
  templateUrl: './notify.component.html',
  styleUrl: './notify.component.scss'
})
export class NotifyComponent implements OnInit {

  private notificationService: NotificationService = inject(NotificationService);
  private userService: UserService = inject(UserService);
  private socketService: SocketService = inject(SocketService);
  private route: Router = inject(Router);
  defaultAvatar = defaultAvatar;
  notifies: NotifyResponse[] = []
  isLoading = signal<boolean>(true);

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
      this.notifies = response.data.map(item => ({
        id: item.id!,
        isViewed: item.isRead,
        content: item.content,
        shortContent: item.content.substring(0, 200),
        read: item.read,
        from: {
          id: item.fromUser?.id || '',
          avatar: item.fromUser?.avatar || '',
          name: item.fromUser?.name || ''
        } || null,
        createdAt: item.createdAt,
        navigateToDetailUrl: item.navigateToDetailUrl
      }));
      this.notificationService.updateCountUnReadNotification(this.notifies.filter(item=>!item.isViewed).length);
    })
  }
  ngOnInit(): void {
    this.getNotification();
    this.socketService.onNotification().subscribe(()=>{
      console.log('onNotification')
      this.getNotification();
    });
  }
  handleViewNotification(item: NotifyResponse) {
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
}
