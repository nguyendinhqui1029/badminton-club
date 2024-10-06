import { afterNextRender, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { UserService } from '@app/services/user.service';
import { getUserInfoFromToken } from '@app/utils/auth.util';
import { localStorageKey } from '@app/constants/common.constant';
import { MessageService } from 'primeng/api';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { LocationService } from '@app/services/location.service';
import { ServiceWorkerService } from '@app//services/service-worker.service';

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
  private serviceWorkerService: ServiceWorkerService = inject(ServiceWorkerService);
  private locationService: LocationService = inject(LocationService);

  title = 'client';
  breakpoints = { '410px': { width: '100%', right: '0', left: '0' } };

  constructor() {
    afterNextRender(() => {
      const currentUserLogin = getUserInfoFromToken(localStorage.getItem(localStorageKey.ACCESS_TOKEN));
      this.userService.updateData(currentUserLogin);


      // Init service worker
      this.serviceWorkerService.requestNotificationPermission().subscribe(permission=>{
        if (permission == 'granted') {
          this.serviceWorkerService.checkNewVersionUpdate();
        }
      });
       // End Init service worker
      this.locationService.saveUserLocationWhenOffLine();
    });
  }
}
