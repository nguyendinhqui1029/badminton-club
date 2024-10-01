import { isPlatformBrowser } from '@angular/common';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '@app/environments/environment';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { SocketService } from '../socket.service';
import { NotificationResponseValue } from '@app/models/notify.model';

@Injectable({
  providedIn: 'root'
})
export class UserSocketService {
  private socket!: Socket;
  private isBrowser: boolean;
  constructor(private socketService: SocketService, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.socket = this.socketService.getSocket();
  }

  sendLoginSuccess(userId: string) {
    this.socket.emit('login-success', userId);
  }
}