import { isPlatformBrowser } from '@angular/common';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import {  Socket } from 'socket.io-client';
import { SocketService } from '../services/socket.service';
import { NotificationSocketParams, NotificationSocketResponseValue } from '@app/models/notify.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationSocket {
  private socket!: Socket;
  private isBrowser: boolean;
  constructor(private socketService: SocketService, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.socket = this.socketService.getSocket();
  }

  sendNotificationEvent(params: NotificationSocketParams) {
    this.socket.emit('clientNotificationEvent',params);
  }

  listenNotificationEvent() {
    return new Observable<string>(observer => {
      if (this.isBrowser) {
        this.socket.on('serverNotificationEvent', (type: string) => {
          observer.next(type);
        });
      }
      
      return () => {
        this.socket.off('serverNotificationEvent');
      };
    });
  }
}