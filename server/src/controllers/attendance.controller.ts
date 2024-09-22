import mongoose from 'mongoose';
import AttendanceService from '../services/attendance.service';
import { Request, Response } from 'express';

export default class AttendanceController {
  private attendanceService: AttendanceService;

  constructor() {
    this.attendanceService = new AttendanceService();
  }

  public getAllByIdUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const idUser = new mongoose.Types.ObjectId(req.query['idUser']?.toString());
      const fromDate = req.query['fromDate']?.toString() || '';
      const toDate = req.query['toDate']?.toString() || '';
      const attendanceResult = await this.attendanceService.getByIdUser(idUser,fromDate, toDate);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Get getAllByIdUser is successful.',
        totalCount: 0,
        page: 0,
        data: attendanceResult 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Get getAllByIdUser is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public getAllByCreatedDate = async (req: Request, res: Response): Promise<void> => {
    try {
      const createdDate = req.query['createdDate']?.toString() || '';
      const attendanceResult = await this.attendanceService.getAllByCreatedDate(createdDate);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Get getAllByCreatedDate is successful.',
        totalCount: 0,
        page: 0,
        data: attendanceResult 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Get getAllByCreatedDate is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const attendanceResult = await this.attendanceService.getAll();
      res.status(200).json({
        statusCode: 200,
        statusText: 'GetAll is successful.',
        totalCount: 0,
        page: 0,
        data: attendanceResult 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'GetAll is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const attendanceResult = await this.attendanceService.getById(req.params.id);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Get user is successful.',
        totalCount: 0,
        page: 0,
        data: attendanceResult 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'GetById is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const attendance = await this.attendanceService.create(req.body);
      res.status(200).json({
        statusCode: 200,
        statusText: 'create is successful.',
        totalCount: 0,
        page: 0,
        data: attendance 
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
      const updatedResult = await this.attendanceService.update(req.params.id, req.body);
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

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.attendanceService.delete(req.params.id);
      res.status(200).json({
        statusCode: 200,
        statusText: 'delete is successful.',
        totalCount: 0,
        page: 0,
        data: result 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'delete is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

}