import SettingsService from '../services/settings.service';
import { Request, Response } from 'express';

export default class SettingsController {
  private settingsService: SettingsService;

  constructor() {
    this.settingsService = new SettingsService();
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const settingsResult = await this.settingsService.getAll();
      res.status(200).json(settingsResult);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const settingsResult = await this.settingsService.getById(req.params.id);
      res.status(200).json(settingsResult);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const settings = await this.settingsService.create(req.body);
      res.status(201).json(settings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedResult = await this.settingsService.update(req.params.id, req.body);
      res.status(200).json(updatedResult);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.settingsService.delete(req.params.id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

}