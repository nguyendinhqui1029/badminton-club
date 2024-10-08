import mongoose from 'mongoose';
import { SocketConnectInformation, SocketConnectInformationModel } from './../models/socket-connect-information.model';


export default class SocketConnectInformationService {

  public async getAll(): Promise<SocketConnectInformation[] > {
    return await SocketConnectInformationModel.find();
  }

  public async getByIdUser(id: string): Promise<SocketConnectInformation | null> {
    return await SocketConnectInformationModel.findOne({idUser: new mongoose.Types.ObjectId(id)});
  }

  public async getByMultipleIdUser(ids: string[]): Promise<SocketConnectInformation[] > {
    const objectIds = ids.map(id=>new mongoose.Types.ObjectId(id));
    return await SocketConnectInformationModel.find({idUser: {$in: objectIds}});
  }

  public async create(socketConnectInformation: SocketConnectInformation): Promise<SocketConnectInformation> {
    return await SocketConnectInformationModel.create(socketConnectInformation);
  }

  public async update(id: string, socketConnectInformation: Partial<SocketConnectInformation>): Promise<SocketConnectInformation | null> {
    return await SocketConnectInformationModel.findOneAndUpdate({idUser: new mongoose.Types.ObjectId(id)}, {$set: socketConnectInformation}, { new: true });
  }

  public async delete(id: string): Promise<SocketConnectInformation | null> {
    return await SocketConnectInformationModel.findOneAndDelete({idUser: new mongoose.Types.ObjectId(id)}, { new: true });
  }
}