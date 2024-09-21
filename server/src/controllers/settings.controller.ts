import SettingsService from '../services/settings.service';
import { Request, Response } from 'express';

export default class SettingsController {
  private settingsService: SettingsService;

  constructor() {
    this.settingsService = new SettingsService();
  }

  public getSetting = async (req: Request, res: Response): Promise<void> => {
    try {
      const settingsResult = await this.settingsService.getSetting();
      res.status(200).json({
        statusCode: 200,
        statusText: 'Setting is success.',
        totalCount: 0,
        page: 0,
        data: settingsResult
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Setting is error.',
        totalCount: 0,
        page: 0,
        data: error
      });
    }
  };


  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const settings = await this.settingsService.create(req.body);
      res.status(200).json({
        statusCode: 200,
        statusText: 'create is success.',
        totalCount: 0,
        page: 0,
        data: settings
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'create is error.',
        totalCount: 0,
        page: 0,
        data: error
      });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedResult = await this.settingsService.update(req.params.id, req.body);
      res.status(200).json({
        statusCode: 200,
        statusText: 'update is success.',
        totalCount: 0,
        page: 0,
        data: updatedResult
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'update is error.',
        totalCount: 0,
        page: 0,
        data: error
      });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.settingsService.delete(req.params.id);
      res.status(200).json({
        statusCode: 200,
        statusText: 'delete is success.',
        totalCount: 0,
        page: 0,
        data: result
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'delete is error.',
        totalCount: 0,
        page: 0,
        data: error
      });
    }
  };

}