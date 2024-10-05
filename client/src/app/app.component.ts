import { afterNextRender, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { UserService } from '@app/services/user.service';
import { getUserInfoFromToken } from '@app/utils/auth.util';
import { localStorageKey } from '@app/constants/common.constant';
import { MessageService } from 'primeng/api';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { PushNotificationService } from '@app/services/push-notification.service';
import { LocationService } from '@app/services/location.service';

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
  private swUpdate: SwUpdate = inject(SwUpdate);
  private swPush: SwPush = inject(SwPush);
  private pushNotificationService: PushNotificationService = inject(PushNotificationService);
  private locationService: LocationService = inject(LocationService);

  title = 'client';
  breakpoints = { '410px': { width: '100%', right: '0', left: '0' } };

  constructor() {
    afterNextRender(() => {
      const currentUserLogin = getUserInfoFromToken(localStorage.getItem(localStorageKey.ACCESS_TOKEN));
      this.userService.updateData(currentUserLogin);
    });
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

    // this.pushNotificationService.requestSubscription();
    // New
  }
  ngOnInit(): void {
    this.locationService.saveUserLocationWhenOffLine()
  }
}
