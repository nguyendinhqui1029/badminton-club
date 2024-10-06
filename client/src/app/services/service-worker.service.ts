import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { environment } from '@app/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceWorkerService {
  private http: HttpClient = inject(HttpClient);
  private swPush: SwPush = inject(SwPush);
  private updates: SwUpdate = inject(SwUpdate);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  checkNewVersionUpdate() {
    if (this.updates.isEnabled) {
      this.updates.versionUpdates.subscribe(() => {
        if (confirm('New version available. Load New Version?')) {
          window.location.reload();
        }
      });
    }
  }

  requestNotificationPermission() {
    return new Observable((subscriber) => {
      Notification.requestPermission().then(permission => {
        subscriber.next(permission);
        subscriber.complete();
      })
    });
  }

  requestSubscription() {
    return this.swPush.requestSubscription({ serverPublicKey: environment.pushNotificationPublishKey }).then((subscription) => {
      this.http.post(`${environment.apiUrl}/api/v1/notification/subscription`, subscription)
    });
  }

  sendNotification() {
    return this.http.post(`${environment.apiUrl}/api/v1/notification/send-notification`, {});
  }
}