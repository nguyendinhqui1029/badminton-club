import { environment } from './environments/environment.prod';
import { afterNextRender, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { UserService } from '@app/services/user.service';
import { getUserInfoFromToken } from '@app/utils/auth.util';
import { localStorageKey } from '@app/constants/common.constant';
import { MessageService } from 'primeng/api';
import { SwPush, SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { LocationService } from '@app/services/location.service';
import { combineLatest, filter } from 'rxjs';
import { SocketService } from '@app/services/socket.service';
import { ServiceWorkerService } from '@app/services/service-worker.service';

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

  title = 'Smilegate Badminton Club';
  breakpoints = { '410px': { width: '100%', right: '0', left: '0' } };

  constructor(private swPush: SwPush, private swUpdate: SwUpdate) {
    afterNextRender(() => {
      const currentUserLogin = getUserInfoFromToken(localStorage.getItem(localStorageKey.ACCESS_TOKEN));
      this.userService.updateData(currentUserLogin);
      this.locationService.saveUserLocationWhenOffLine();
    });
    // Init service worker
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
    }
  }
  ngOnInit(): void {
    this.requestNotificationPermission();
    // End Init service worker
    combineLatest([this.socketService.onSocketIdChange(), this.userService.currentUserLogin]).subscribe(([socketId, user]) => {
      if (user.id && socketId) {
        this.swPush.requestSubscription({ serverPublicKey: environment.pushNotificationPublishKey }).then((subscription) => {
          this.serviceWorkerService.requestSubscription({ socketId: socketId, idUser: user.id, subscription }).subscribe();
        });
      }
    });
  }
  requestNotificationPermission() {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        // You can now subscribe the user to push notifications
      } else {
        console.error('Notification permission denied.');
      }
    });
  }
}
