import mongoose from 'mongoose';
import { Request, Response } from 'express';
import SocketConnectInformationService from '../services/socket-connect-information.service';

export default class SocketConnectInformationController {
  private socketConnectInformationService!: SocketConnectInformationService;
  constructor() {
    this.socketConnectInformationService = new SocketConnectInformationService();
  }
  public getBySocketId = async (req: Request, res: Response): Promise<void> => {
    try {
      const socketConnectInformationResult = await this.socketConnectInformationService.getByIdUser(req.params.id);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Get socketConnectInformationService is successful.',
        totalCount: 0,
        page: 0,
        data: socketConnectInformationResult
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Get socketConnectInformationService is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const socketConnectInformation = await this.socketConnectInformationService.create(req.body);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Create socketConnectInformation is successful.',
        totalCount: 0,
        page: 0,
        data: socketConnectInformation
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Create socketConnectInformation is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedResult = await this.socketConnectInformationService.update(req.params.id, req.body);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Get socketConnectInformation is successful.',
        totalCount: 0,
        page: 0,
        data: updatedResult
      });
      res.status(200).json();
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Get socketConnectInformation is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.socketConnectInformationService.delete(req.params.id);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Delete socketConnectInformation is successful.',
        totalCount: 0,
        page: 0,
        data: result
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Delete socketConnectInformation is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

}