import AttendanceService from '../services/attendance.service';
import { Request, Response } from 'express';

export default class AttendanceController {
  private attendanceService: AttendanceService;

  constructor() {
    this.attendanceService = new AttendanceService();
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const attendanceResult = await this.attendanceService.getAll();
      res.status(200).json(attendanceResult);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const attendanceResult = await this.attendanceService.getById(req.params.id);
      res.status(200).json(attendanceResult);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const attendance = await this.attendanceService.create(req.body);
      res.status(201).json(attendance);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedResult = await this.attendanceService.update(req.params.id, req.body);
      res.status(200).json(updatedResult);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.attendanceService.delete(req.params.id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

}