import { isPlatformBrowser } from '@angular/common';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import {  Socket } from 'socket.io-client';
import { SocketService } from '../socket.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationSocketService {
  private socket!: Socket;
  private isBrowser: boolean;
  constructor(private socketService: SocketService, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.socket = this.socketService.getSocket();
  }

  sendNotification(to: string[]) {
    this.socket.emit('send-notify',to);
  }

  onNotification() {
    return new Observable<void>(observer => {
      if (this.isBrowser) {
        this.socket.on('has-new-notification', () => {
          observer.next();
        });
      }
      
      return () => {
        this.socket.off('has-new-notification');
      };
    });
  }
}