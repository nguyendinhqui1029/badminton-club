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
import { ServiceWorkerService } from '@app//services/service-worker.service';
import { filter } from 'rxjs';

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
  private locationService: LocationService = inject(LocationService);
  private messageService: MessageService = inject(MessageService);

  title = 'Smilegate Badminton Club';
  breakpoints = { '410px': { width: '100%', right: '0', left: '0' } };

  constructor( private swPush: SwPush, private swUpdate: SwUpdate) {
    afterNextRender(() => {
      const currentUserLogin = getUserInfoFromToken(localStorage.getItem(localStorageKey.ACCESS_TOKEN));
      this.userService.updateData(currentUserLogin);
       // End Init service worker
      this.locationService.saveUserLocationWhenOffLine();
    });
     // Init service worker
     if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
      .pipe(filter((event): event is VersionReadyEvent=> event.type === 'VERSION_READY'))
      .subscribe(()=>{
        this.messageService.add({ severity: 'success', summary: 'Thông báo cập nhật', detail: 'Bản cập nhật mới đã sẵn sàng.' })
        this.swUpdate.activateUpdate().then(()=>window.location.reload());
      });
      this.swPush.messages.subscribe((message)=>{
        console.log('Push message', message)
      });
      this.swPush.requestSubscription({serverPublicKey: environment.pushNotificationPublishKey}).then((subscription)=>{
        console.log('subscription 2', subscription)
      });
    }
  }
}
