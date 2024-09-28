import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http'; // Import http
import { Post } from '../models/post.model';


export default class SocketIoController {
  private static io: SocketIOServer; // Add io property
  private static server: http.Server;
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
      console.log('A user connected');
      
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
        socket.broadcast.emit('has-post-delete', idPost);
      });

      // Handle Notification When Create Post
      socket.on('create-post-notify', () => {
        // Broadcast the message to all connected clients
        socket.broadcast.emit('has-new-notification');
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
  }
}