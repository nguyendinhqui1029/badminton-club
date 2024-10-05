import { isPlatformBrowser } from '@angular/common';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '@app/environments/environment';
import { io, Socket } from 'socket.io-client';
import { UserService } from '@app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object, private userService: UserService) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser && !this.socket) {
      this.socket = io(environment.apiUrl, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 5000,
        auth: {
          idUser: this.userService.currentUserLogin.getValue().id
        }
      });
    }
  }

  public getSocket() {
    return this.socket;
  }
}