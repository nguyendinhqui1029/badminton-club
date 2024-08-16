import EventService from '../services/event.service';
import { Request, Response } from 'express';

export default class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const eventResult = await this.eventService.getAll();
      res.status(200).json(eventResult);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const eventResult = await this.eventService.getById(req.params.id);
      res.status(200).json(eventResult);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const event = await this.eventService.create(req.body);
      res.status(201).json(event);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedResult = await this.eventService.update(req.params.id, req.body);
      res.status(200).json(updatedResult);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.eventService.delete(req.params.id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

}