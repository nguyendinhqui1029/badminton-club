import { isPlatformBrowser } from '@angular/common';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '@app/environments/environment';
import { PostResponseValue } from '@app/models/post.model';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser && !this.socket) {
      this.socket = io(environment.apiUrl, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 5000
      });
    }
  }

  public getSocket() {
    return this.socket;
  }
  // Method to send messages
  sendPostLike(post: PostResponseValue): void {
    this.socket.emit('like', post);
  }

  // Method to listen for messages
  onPostLike() {
    return new Observable<PostResponseValue>(observer => {
      if (this.isBrowser) {
        this.socket.on('update-like-post', (post: PostResponseValue) => {
          observer.next(post);
        });
      }
      
      return () => {
        this.socket.off('update-like-post');
      };
    });
  }

  // Method to send messages
  sendPostComment(postId: string): void {
    this.socket.emit('comment', postId);
  }

  // Method to listen for messages
  onPostComment() {
    return new Observable<string>(observer => {
      if (this.isBrowser) {
        this.socket.on('update-comment-post', (postId: string) => {
          observer.next(postId);
        });
      }
      
      return () => {
        this.socket.off('update-comment-post');
      };
    });
  }

  sendDeletePost(idPost: string) {
    this.socket.emit('delete-post', idPost);
  }

  onPostDelete() {
    return new Observable<string>(observer => {
      if (this.isBrowser) {
        this.socket.on('has-post-delete', (id: string) => {
          observer.next(id);
        });
      }
      
      return () => {
        this.socket.off('has-post-delete');
      };
    });
  }


  sendNotificationPostCreate() {
    this.socket.emit('create-post-notify');
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