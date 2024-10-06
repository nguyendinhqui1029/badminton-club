import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http'; // Import http
import { Post } from '../models/post.model';
import { SocketConnectInformation } from '../models/socket-connect-information.model';
import SocketConnectInformationService from '../services/socket-connect-information.service';
import NotificationService from '../services/notification.service';


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

  private async updateConnectInfo(idUser: string, data: Partial<SocketConnectInformation>) {
    const socketConnect = await this.socketConnectInfo.getByIdUser(idUser);
    if(socketConnect) {
      return this.socketConnectInfo.update(idUser, data);
    }
    return this.socketConnectInfo.create(data);
  }

  private resendNotification(idUser: string) {
    console.log('this.mappingSocketId[idUser].socketId',this.mappingSocketId[idUser].socketId)
    SocketIoController.io.to(this.mappingSocketId[idUser].socketId).emit('has-new-notification');;
  }

  public socketIOConfig(): void {
    SocketIoController.io = SocketIoController.getSocketIo();
    SocketIoController.io.on('connection', (socket: Socket) => {
      console.log('socket.handshake?.auth?.idUser',socket.handshake?.auth?.idUser)
      if(socket.handshake?.auth?.idUser) {
        this.mappingSocketId[socket.handshake?.auth?.idUser] = {
          socketId: socket.id,
          idUser: socket.handshake?.auth?.idUser,
          ipAddress: socket.handshake.address,
          subscription: null
        };
        this.updateConnectInfo(socket.handshake?.auth?.idUser, this.mappingSocketId[socket.handshake?.auth?.idUser]);
        this.resendNotification(socket.handshake?.auth?.idUser);
      }
      socket.on('login-success', (userId: string) => {
        console.log('login-success',socket.handshake?.auth?.idUser)

        this.updateConnectInfo(userId, {
          socketId: socket.id,
          idUser: socket.handshake?.auth?.idUser,
          ipAddress: socket.handshake.address,
          subscription: null
        });
        this.resendNotification(socket.handshake?.auth?.idUser);
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
          const socketInfo = this.mappingSocketId[item];
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
          SocketIoController.io.to(socketInfo.socketId).emit('has-new-notification');
        })
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.mappingSocketId[socket.handshake?.auth?.idUser] = {
          socketId: '',
          idUser: socket.handshake?.auth?.idUser,
          ipAddress: '',
          subscription: this.mappingSocketId[socket.handshake?.auth?.idUser].subscription
        };
        this.updateConnectInfo(socket.handshake?.auth?.idUser, this.mappingSocketId[socket.handshake?.auth?.idUser]);
      });
    });
  }
}