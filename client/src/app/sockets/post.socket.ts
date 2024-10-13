import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { PostResponseValue } from '@app/models/post.model';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io-client';
import { SocketService } from '../services/socket.service';

@Injectable({
  providedIn: 'root'
})
export class PostSocket {
  private socket!: Socket;

  private isBrowser: boolean;
  constructor(private socketService: SocketService, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.socket = this.socketService.getSocket();
  }

  // Send Event Like Post To Server
  sendLikePostEvent(post: PostResponseValue): void {
    this.socket.emit('clientLikePostEvent', post);
  }

  // Listen Event Like Post From Server
  listenLikePostEvent() {
    return new Observable<PostResponseValue>(observer => {
      if (this.isBrowser) {
        this.socket.on('serverLikePostEvent', (post: PostResponseValue) => {
          observer.next(post);
        });
      }
      
      return () => {
        this.socket.off('serverLikePostEvent');
      };
    });
  }

  // Send Event Comment Post To Server
  sendCommentPostEvent(post: PostResponseValue): void {
    this.socket.emit('clientCommentPostEvent', post);
  }

  // Listen Event Comment Post From Server
  listenCommentPostEvent() {
    return new Observable<PostResponseValue>(observer => {
      if (this.isBrowser) {
        this.socket.on('serverCommentPostEvent', (post: PostResponseValue) => {
          observer.next(post);
        });
      }
      
      return () => {
        this.socket.off('serverCommentPostEvent');
      };
    });
  }

  sendDeletePostEvent(post: PostResponseValue) {
    this.socket.emit('clientDeletePostEvent', post);
  }

  listenDeletePostEvent() {
    return new Observable<PostResponseValue>(observer => {
      if (this.isBrowser) {
        this.socket.on('serverDeletePostEvent', (post: PostResponseValue) => {
          observer.next(post);
        });
      }
      
      return () => {
        this.socket.off('serverDeletePostEvent');
      };
    });
  }

  // Method to send messages
  sendAddPostEvent(post: PostResponseValue): void {
    this.socket.emit('clientAddPostEvent', post);
  }

  // Method to listen for messages
  listenAddPostEvent() {
    return new Observable<PostResponseValue>(observer => {
      if (this.isBrowser) {
        this.socket.on('serverAddPostEvent', (post: PostResponseValue) => {
          observer.next(post);
        });
      }
      return () => {
        this.socket.off('serverAddPostEvent');
      };
    });
  }

  // Method to send messages
  sendUpdatePostEvent(post: PostResponseValue): void {
    this.socket.emit('clientUpdatePostEvent', post);
  }

  // Method to listen for messages
  listenUpdatePostEvent() {
    return new Observable<PostResponseValue>(observer => {
      if (this.isBrowser) {
        this.socket.on('serverUpdatePostEvent', (post: PostResponseValue) => {
          observer.next(post);
        });
      }
      return () => {
        this.socket.off('serverUpdatePostEvent');
      };
    });
  }
}