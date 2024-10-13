import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http'; // Import http
import { SocketConnectInformation } from '../models/socket-connect-information.model';
import SocketConnectInformationService from '../services/socket-connect-information.service';
import PostSocket from '../sockets/post.socket';
import NotificationSocket from '../sockets/notification.socket';

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
    const postSocket = new PostSocket(SocketIoController.io);
    const notificationSocket = new NotificationSocket(SocketIoController.io);

    SocketIoController.io.on('connection',(socket: Socket) => {
      console.log('connection',socket.id)
      SocketIoController.io.to(socket.id).emit('sendSocketIdToClient', socket.id);
      socket.on('requestGetNewSocketConnect',()=>{
        setTimeout(()=>this.getAllSocketConnect(),100);
        SocketIoController.io.to(socket.id).emit('serverNotificationEvent','');;
      });
      
      // Listen Post Event 
      postSocket.postSocketListener(socket, this.mappingSocketId);
      notificationSocket.notificationSocketListener(socket, this.mappingSocketId);
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