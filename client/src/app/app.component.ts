import { environment } from './environments/environment.prod';
import { afterNextRender, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { UserService } from '@app/services/user.service';
import { getUserInfoFromToken } from '@app/utils/auth.util';
import { localStorageKey, notificationStatus, notificationType } from '@app/constants/common.constant';
import { MessageService } from 'primeng/api';
import { SwPush, SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { LocationService } from '@app/services/location.service';
import { combineLatest, filter } from 'rxjs';
import { SocketService } from '@app/services/socket.service';
import { ServiceWorkerService } from '@app/services/service-worker.service';
import { NotificationSocketParams } from '@app/models/notify.model';
import { NotificationSocket } from '@app/sockets/notification.socket';
import { NotificationService } from '@app/services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService]
})
export class AppComponent implements OnInit {
  private userService: UserService = inject(UserService);
  private locationService: LocationService = inject(LocationService);
  private messageService: MessageService = inject(MessageService);
  private socketService: SocketService = inject(SocketService);
  private serviceWorkerService: ServiceWorkerService = inject(ServiceWorkerService);
  private notificationSocket: NotificationSocket = inject(NotificationSocket);
  private notificationService: NotificationService = inject(NotificationService);

  title = 'Smilegate Badminton Club';
  breakpoints = { '410px': { width: '100%', right: '0', left: '0' } };

  constructor(private swPush: SwPush, private swUpdate: SwUpdate) {
    afterNextRender(() => {
      const currentUserLogin = getUserInfoFromToken(localStorage.getItem(localStorageKey.ACCESS_TOKEN));
      this.userService.updateData(currentUserLogin);
      this.locationService.saveUserLocationWhenOffLine();
    });
  }
  ngOnInit(): void {
    this.requestNotificationPermission();
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'))
        .subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Thông báo cập nhật', detail: 'Bản cập nhật mới đã sẵn sàng.' })
          this.swUpdate.activateUpdate().then(() => window.location.reload());
        });
      this.swPush.messages.subscribe((message) => {
        console.log('Push message', message)
      });
      this.swPush.notificationClicks.subscribe((messageInfo) => {
        if(messageInfo.notification.data.type === notificationType.POST) {
          const currentUserId = this.userService.currentUserLogin.getValue().id;
          this.notificationService.updateNotification({
            id: messageInfo.notification.data.notificationId,
            read: [...messageInfo.notification.data.read,currentUserId]
          }).subscribe((response)=>{
            const params: NotificationSocketParams = {
              to: [currentUserId],
              type: notificationType.RELOAD_DATA,
              notifyInfo: response.data
            }
            this.notificationSocket.sendNotificationEvent(params);
          })
        }
      });
    }
    // End Init service worker
    combineLatest([this.socketService.onSocketIdChange(), this.userService.currentUserLogin]).subscribe(([socketId, user]) => {
      if (user.id && socketId) {
        if(this.checkPushSupport()) {
          this.swPush.requestSubscription({ serverPublicKey: environment.pushNotificationPublishKey }).then((subscription) => {
            this.serviceWorkerService.requestSubscription({ socketId: socketId, idUser: user.id, subscription }).subscribe(()=>{
              this.socketService.sendRequestGetNewSocketConnect();
            });
          });
          return;
        }
         
        this.serviceWorkerService.requestSubscription({ socketId: socketId, idUser: user.id }).subscribe(()=>{
            this.socketService.sendRequestGetNewSocketConnect();
        });
      }
    });
  } 
  checkPushSupport() {
    // Kiểm tra xem trình duyệt hỗ trợ Service Workers
    if (!('serviceWorker' in navigator)) {
      return false;
    }
    // Kiểm tra khả năng hỗ trợ thông báo
    if (!('Notification' in window)) {
      return false;
    }
    // Kiểm tra trạng thái cho phép thông báo
    if (Notification.permission === 'denied') {
      return this.requestNotificationPermission();
    }

    return true;
  }

  requestNotificationPermission() {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          return true;
        }
        return false;
      });   
  }
}
