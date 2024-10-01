import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { ApiResponseValue } from '@app/models/api-response.model';
import { NotificationRequestBody, NotificationRequestParams, NotificationResponseValue } from '@app/models/notify.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http: HttpClient = inject(HttpClient);
  private countNewNotification = new BehaviorSubject<number>(0);

  get getCountNewNotification():BehaviorSubject<number> {
    return this.countNewNotification;
  }

  updateCountUnReadNotification(value: number) {
    this.countNewNotification.next(value);
  }

  getAllNotificationFromUser(requestParams: NotificationRequestParams): Observable<ApiResponseValue<NotificationResponseValue[]>> {
    const params = new HttpParams().set('idUser',requestParams.idUser).set('limit',requestParams.limit).set('page',requestParams.page).set('type',requestParams.type || '');
    return this.http.get<ApiResponseValue<NotificationResponseValue[]>>(`${environment.apiUrl}/api/v1/notification/from`, {params});

  }

  getAllNotificationToUser(requestParams: NotificationRequestParams): Observable<ApiResponseValue<NotificationResponseValue[]>> {
    const params = new HttpParams().set('idUser',requestParams.idUser).set('limit',requestParams.limit).set('page',requestParams.page);
    return this.http.get<ApiResponseValue<NotificationResponseValue[]>>(`${environment.apiUrl}/api/v1/notification/to`, {params});

  }

  createNotification(body: NotificationRequestBody): Observable<ApiResponseValue<NotificationResponseValue>> {
    return this.http.post<ApiResponseValue<NotificationResponseValue>>(`${environment.apiUrl}/api/v1/notification`, body);
  }

  updateNotification(body: Partial<NotificationRequestBody>): Observable<ApiResponseValue<NotificationResponseValue>> {
    return this.http.put<ApiResponseValue<NotificationResponseValue>>(`${environment.apiUrl}/api/v1/notification`, body);
  }
}