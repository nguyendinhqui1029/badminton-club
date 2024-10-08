import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http'; // Import http
import { Post } from '../models/post.model';
import { SocketConnectInformation } from '../models/socket-connect-information.model';
import SocketConnectInformationService from '../services/socket-connect-information.service';

export default class SocketIoController {
  private static io: SocketIOServer; // Add io property
  private static server: http.Server;
  private mappingSocketId: Record<string, SocketConnectInformation> = {};
  private socketConnectInfo: SocketConnectInformationService;

  constructor(server: http.Server) {
    SocketIoController.server = server;
    this.socketConnectInfo = new SocketConnectInformationService();
  }
  static getSocketIo() {
    if (SocketIoController.io) {
      return SocketIoController.io;
    }
    return new SocketIOServer(this.server);
  }

  private async getAllSocketConnect() {
    const response = await this.socketConnectInfo.getAll();
    if(!response.length) {
      return;
    }
    response.forEach(item=>{
      this.mappingSocketId[item.idUser] = {
        _id: item._id,
        socketId: item.socketId,
        idUser: item.idUser,
        subscription: item.subscription
      };
    })
  }
  public socketIOConfig(): void {
    SocketIoController.io = SocketIoController.getSocketIo();
    SocketIoController.io.on('connection', (socket: Socket) => {
      console.log('connection',socket.id)
      this.getAllSocketConnect();
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
          const socketInfo = this.mappingSocketId[item];
          if(!socketInfo) {
            return;
          }
          SocketIoController.io.to(socketInfo.socketId).emit('update-post-list', idPost);
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
          const socketInfo = this.mappingSocketId[item];
          if(!socketInfo) {
            return;
          }
          SocketIoController.io.to(socketInfo.socketId).emit('has-new-notification');
        })
      });

      // Handle disconnection
      socket.on('disconnect', async () => {
        if(!socket.handshake?.auth?.idUser){
          return;
        }
        const deleteResult = await this.socketConnectInfo.delete(socket.handshake?.auth?.idUser);
        if(!deleteResult) {
          delete this.mappingSocketId[socket.handshake?.auth?.idUser];
        }
      });
    });
  }
}