import { SocketConnectInformation, SocketConnectInformationModel } from './../models/socket-connect-information.model';


export default class SocketConnectInformationService {

  public async getBySocketId(id: string): Promise<SocketConnectInformation | null> {
    return await SocketConnectInformationModel.findOne({socketId: id});
  }

  public async create(socketConnectInformation: SocketConnectInformation): Promise<SocketConnectInformation> {
    return await SocketConnectInformationModel.create(socketConnectInformation);
  }

  public async update(id: string, socketConnectInformation: SocketConnectInformation): Promise<SocketConnectInformation | null> {
    return await SocketConnectInformationModel.findOneAndUpdate({socketId: id}, socketConnectInformation, { new: true });
  }

  public async delete(id: string): Promise<SocketConnectInformation | null> {
    return await SocketConnectInformationModel.findOneAndDelete({socketId: id}, { new: true });
  }
}