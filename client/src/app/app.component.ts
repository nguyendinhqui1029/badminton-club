import { afterNextRender, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { UserService } from '@app/services/user.service';
import { getUserInfoFromToken } from '@app/utils/auth.util';
import { localStorageKey } from '@app/constants/common.constant';
import { MessageService } from 'primeng/api';
import { environment } from './environments/environment';
import { HttpClient } from '@angular/common/http';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { PushNotificationService } from '@app/services/push-notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService]
})
export class AppComponent {
  private userService: UserService = inject(UserService);
  private http: HttpClient = inject(HttpClient);
  private swUpdate: SwUpdate = inject(SwUpdate);
  private swPush: SwPush = inject(SwPush);
  private pushNotificationService: PushNotificationService = inject(PushNotificationService);
  
  title = 'client';
  breakpoints = { '410px': { width: '100%', right: '0', left: '0' } };

  constructor() {
    afterNextRender(() => {
      const currentUserLogin = getUserInfoFromToken(localStorage.getItem(localStorageKey.ACCESS_TOKEN));
      this.userService.updateData(currentUserLogin);
    });
    // New
    // if(this.swUpdate.isEnabled) {
    //   setInterval(()=>{
    //     this.swUpdate.checkForUpdate();
    //   }, 6*60*60*1000);

    //   this.swUpdate.versionUpdates.subscribe(()=>{
    //     if(confirm('Load new version')) {
    //       window.location.reload();
    //     }
    //   });
    // }
    if(!this.swUpdate.isEnabled) {
      console.log('Service worker is not enabled.');
      return;
    }

    this.swPush.notificationClicks.subscribe(({action, notification})=>{
      console.log('Notification click', action, notification);
    });

    this.swPush.messages.subscribe((message)=>{
      console.log('Push message', message);
    });

    this.pushNotificationService.requestSubscription();
    // New
  }
}
