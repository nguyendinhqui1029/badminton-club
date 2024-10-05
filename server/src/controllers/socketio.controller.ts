import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http'; // Import http
import { Post } from '../models/post.model';
import { NotificationToUserResponse } from '../models/notification.model';


export default class SocketIoController {
  private static io: SocketIOServer; // Add io property
  private static server: http.Server;
  private mappingSocketId: Record<string, string> = {};
  constructor(server: http.Server) {
    SocketIoController.server = server;
  }
  static getSocketIo() {
    if (SocketIoController.io) {
      return SocketIoController.io;
    }
    return new SocketIOServer(this.server);
  }

  public socketIOConfig(): void {
    SocketIoController.io = SocketIoController.getSocketIo();
    SocketIoController.io.on('connection', (socket: Socket) => {
      this.mappingSocketId[socket.handshake.auth.idUser] = socket.id;
      socket.on('login-success', (userId: string) => {
        this.mappingSocketId[userId] = socket.id;
      });

      // Handle custom events from clients
      socket.on('like', (data: Post) => {
        // Broadcast the message to all connected clients
        SocketIoController.io.emit('update-like-post', data);
      });

      // Handle comment
      socket.on('comment', (data: Post) => {
        // Broadcast the message to all connected clients
        SocketIoController.io.emit('update-comment-post', data);
      });

       // Handle delete post
       socket.on('delete-post', (idPost: string) => {
        // Broadcast the message to all connected clients
        SocketIoController.io.emit('has-post-delete', idPost);
      });

       // Handle change post
       socket.on('send-post-change', (idPost: Post, to: string[]) => {
        // Broadcast the message to all connected clients
        if(!to?.length) {
          SocketIoController.io.emit('update-post-list', idPost);
          return;
        }
        to.forEach((item: string)=>{
          const socketId = this.mappingSocketId[item];
          console.log('socketId', socketId)
          SocketIoController.io.to(socketId).emit('update-post-list', idPost);
        })
      });


      // Handle Notification When Create Post
      socket.on('send-notify', (to: string[]) => {
        // Broadcast the message to all connected clients
        if(!to?.length) {
          SocketIoController.io.emit('has-new-notification');
          return;
        }
        to.forEach((item: string)=>{
          const socketId = this.mappingSocketId[item];
          SocketIoController.io.to(socketId).emit('has-new-notification');
        })
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
      });
    });
  }
}