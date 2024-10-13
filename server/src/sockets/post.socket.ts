
import UserService from '../services/user.service';
import { scopePost } from '../constants/common.constants';
import { Post } from '../models/post.model';
import { SocketConnectInformation } from '../models/socket-connect-information.model';
import { Server as SocketIOServer, Socket } from 'socket.io';
export default class PostSocket {
  private io: SocketIOServer;
  private userService: UserService;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.userService = new UserService();
  }

  postSocketListener(socket: Socket, mappingSocketId: Record<string, SocketConnectInformation>) {

    // Like Post
    socket.on('clientLikePostEvent', (post: Post) => {
      // Broadcast the message to all connected clients
      if (post.scope === scopePost.EVERYONE) {
        this.io.emit('serverLikePostEvent', post);
        return;
      }
      if (post.scope === scopePost.ONLY_ME) {
        const socketId = mappingSocketId[post.createdBy]?.socketId;
        if (socketId) {
          this.io.to(socketId).emit('serverLikePostEvent', post);
        }
        return;
      }
      if (post.scope === scopePost.FRIENDS) {
        this.userService.getUserById(post.createdBy).then((userById) => {
          const friends = userById?.idFriends || [];
          friends.forEach(idUser => {
            const socketId = mappingSocketId[idUser]?.socketId;
            if (socketId) {
              this.io.to(socketId).emit('serverLikePostEvent', post);
            }
          })
        })
      }
    });

    // Comment Post
    socket.on('clientCommentPostEvent', (post: Post) => {
      if (post.scope === scopePost.EVERYONE) {
        this.io.emit('serverCommentPostEvent', post);
        return;
      }
      if (post.scope === scopePost.ONLY_ME) {
        const socketId = mappingSocketId[post.createdBy]?.socketId;
        if (socketId) {
          this.io.to(socketId).emit('serverCommentPostEvent', post);
        }
        return;
      }
      if (post.scope === scopePost.FRIENDS) {
        this.userService.getUserById(post.createdBy).then((userById) => {
          const friends = userById?.idFriends || [];
          friends.forEach(idUser => {
            const socketId = mappingSocketId[idUser]?.socketId;
            if (socketId) {
              this.io.to(socketId).emit('serverCommentPostEvent', post);
            }
          })
        })
      }
    });

    // Delete Post
    socket.on('clientDeletePostEvent', (post: string) => {
      this.io.emit('serverDeletePostEvent', post);
    });

    // Add Post
    socket.on('clientAddPostEvent', (post: Post) => {
      if (post.scope === scopePost.EVERYONE) {
        this.io.emit('serverAddPostEvent', post);
        return;
      }
      if (post.scope === scopePost.ONLY_ME) {
        const socketId = mappingSocketId[post.createdBy]?.socketId;
        if (socketId) {
          this.io.to(socketId).emit('serverAddPostEvent', post);
        }
        return;
      }
      if (post.scope === scopePost.FRIENDS) {
        this.userService.getUserById(post.createdBy).then((userById) => {
          const friends = userById?.idFriends || [];
          friends.forEach(idUser => {
            const socketId = mappingSocketId[idUser]?.socketId;
            if (socketId) {
              this.io.to(socketId).emit('serverAddPostEvent', post);
            }
          })
        })
      }
    });
    
    // Update Post
    socket.on('clientUpdatePostEvent', (post: Post) => {
      if (post.scope === scopePost.EVERYONE) {
        this.io.emit('serverUpdatePostEvent', post);
        return;
      }
      if (post.scope === scopePost.ONLY_ME) {
        const socketId = mappingSocketId[post.createdBy]?.socketId;
        if (socketId) {
          this.io.to(socketId).emit('serverUpdatePostEvent', post);
        }
        return;
      }
      if (post.scope === scopePost.FRIENDS) {
        this.userService.getUserById(post.createdBy).then((userById) => {
          const friends = userById?.idFriends || [];
          friends.forEach(idUser => {
            const socketId = mappingSocketId[idUser]?.socketId;
            if (socketId) {
              this.io.to(socketId).emit('serverUpdatePostEvent', post);
            }
          })
        })
      }
    });
  }
}