import { isPlatformBrowser } from '@angular/common';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '@app/environments/environment';
import { PostResponseValue } from '@app/models/post.model';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { SocketService } from '../socket.service';

@Injectable({
  providedIn: 'root'
})
export class PostSocketService {
  private socket!: Socket;
  private isBrowser: boolean;
  constructor(private socketService: SocketService, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.socket = this.socketService.getSocket();
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

   // Method to send messages
   sendPostChange(post: PostResponseValue, to: string[]): void {
    this.socket.emit('send-post-change', post, to);
  }

  // Method to listen for messages
  onPostChange() {
    return new Observable<PostResponseValue>(observer => {
      if (this.isBrowser) {
        this.socket.on('update-post-list', (post: PostResponseValue) => {
          observer.next(post);
        });
      }
      
      return () => {
        this.socket.off('update-post-list');
      };
    });
  }
}