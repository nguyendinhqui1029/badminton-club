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
  private updates: SwUpdate = inject(SwUpdate);


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

  requestSubscription(body: { socketId: string, idUser: string, subscription: PushSubscription }) {
    this.http.post(`${environment.apiUrl}/api/v1/push-notification/subscription`, body)
  }

  sendNotification(body: { ids: string[], body: { title: string, body: string, icon: string, url: string } }) {
    return this.http.post(`${environment.apiUrl}/api/v1/push-notification/send-notification`, body);
  }
}