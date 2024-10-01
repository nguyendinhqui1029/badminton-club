import mongoose from 'mongoose';
import { Request, Response } from 'express';
import NotificationService from '../services/notification.service';
import UserService from '../services/user.service';

export default class NotificationController {
  private notificationService: NotificationService;
  private userService: UserService;
  constructor() {
    this.notificationService = new NotificationService();
    this.userService = new UserService();
  }

  public getAllNotificationFromUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const params = {
        idUser: req.query['idUser']?.toString() || '',
        limit: Number(req.query['limit']?.toString()),
        page: Number(req.query['page']?.toString()),
        status: req.query['status']?.toString() || '',
        type: req.query['type']?.toString() || ''
      };
      const notificationResult = await this.notificationService.getNotificationFromUser(params);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Get AllNotificationFromUser is successful.',
        totalCount: 0,
        page: 0,
        data: notificationResult 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Get AllNotificationFromUser is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public getAllNotificationToUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const params = {
        idUser: req.query['idUser']?.toString() || '',
        limit: Number(req.query['limit']?.toString()),
        page: Number(req.query['page']?.toString()),
        status: req.query['status']?.toString() || ''
      };
      const notificationResult = await this.notificationService.getNotificationToUser(params);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Get AllNotificationToUser is successful.',
        totalCount: 0,
        page: 0,
        data: notificationResult 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Get AllNotificationToUser is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      let isAllUser = !req.body['to'];
      let to = req.body['to'] || [];
      if(isAllUser) {
        const users = await this.userService.getAllUsers();
        users.forEach(item=>{
          const userId = item._id || '';
          const fromUser = req.body['fromUser'].toString() || '';
          if( userId.toString() !== fromUser) {
            to.push(item?._id );
          }
        });    
      }
      const notification = await this.notificationService.create({...req.body, to});
      res.status(200).json({
        statusCode: 200,
        statusText: 'create is successful.',
        totalCount: 0,
        page: 0,
        data: notification 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'create is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedResult = await this.notificationService.update(req.body.id,req.body);
      res.status(200).json({
        statusCode: 200,
        statusText: 'update is successful.',
        totalCount: 0,
        page: 0,
        data: updatedResult 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'update is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };
}