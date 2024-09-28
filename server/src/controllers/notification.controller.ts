import mongoose from 'mongoose';
import { Request, Response } from 'express';
import NotificationService from '../services/notification.service';

export default class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  public getAllNotificationToUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const params = {
        idUser: req.query['idUser']?.toString() || '',
        limit: Number(req.query['limit']?.toString()),
        page: Number(req.query['page']?.toString()),
        status: req.query['status']?.toString() || 'IN_PROCESS'
      };
      const notificationResult = await this.notificationService.getNotificationToUser(params);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Get Notification is successful.',
        totalCount: 0,
        page: 0,
        data: notificationResult 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Get notificationResult is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const notification = await this.notificationService.create(req.body);
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