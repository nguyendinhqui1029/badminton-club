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
      res.status(200).json({
        statusCode: 200,
        statusText: 'Get Event by id is successful.',
        totalCount: 0,
        page: 0,
        data: eventResult 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Get Event is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public getAllByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
      const idUser = req.params['id'];
      const eventResult = await this.eventService.getAllEventByIdUser(idUser);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Get Event by id is successful.',
        totalCount: 0,
        page: 0,
        data: eventResult 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Get Event is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const eventResult = await this.eventService.getById(req.params.id);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Get Event by id is successful.',
        totalCount: 0,
        page: 0,
        data: eventResult 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Get Event is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const event = await this.eventService.create(req.body);
      res.status(200).json({
        statusCode: 200,
        statusText: 'create Event by id is successful.',
        totalCount: 0,
        page: 0,
        data: event 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'create Event is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedResult = await this.eventService.update(req.params.id, req.body);
      res.status(200).json({
        statusCode: 200,
        statusText: 'update Event by id is successful.',
        totalCount: 0,
        page: 0,
        data: updatedResult 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'update Event is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.eventService.delete(req.params.id);
      res.status(200).json({
        statusCode: 200,
        statusText: 'delete Event by id is successful.',
        totalCount: 0,
        page: 0,
        data: result 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Get Event is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

}