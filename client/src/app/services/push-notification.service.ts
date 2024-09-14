import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { environment } from '@app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private http: HttpClient = inject(HttpClient);
  private swPush: SwPush = inject(SwPush);


  requestSubscription() {
    return this.swPush.requestSubscription({ serverPublicKey: environment.pushNotificationPublishKey }).then((subscription) => {
      console.log('Subscription', subscription);
      this.http.post(`${environment.apiUrl}/api/v1/notification/subscription`, subscription)
    });
  }

  sendNotification() {
    return this.http.post(`${environment.apiUrl}/api/v1/notification/send-notification`, {});
  }
}