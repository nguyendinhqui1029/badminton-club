import mongoose from 'mongoose';
import TransactionService from '../services/transaction.service';
import { Request, Response } from 'express';

export default class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  public getAmountByMonths = async (req: Request, res: Response): Promise<void> => {
    try {
      const startMonth = +(req.query['startMonth']?.toString() || 1);
      const endMonth = +(req.query['endMonth']?.toString() || 12);
      const year = +(req.query['year']?.toString() || new Date().getFullYear());
      const params = [];
      for(let index=startMonth; index <= endMonth; index++) {
        params.push({year: +year, month: index})
      }
      const transactionResult = await this.transactionService.getAmountByMonths(params);
      res.status(200).json({
        statusCode: 200,
        statusText: 'getAmountByMonths transaction is successful.',
        totalCount: 0,
        page: 0,
        data: transactionResult
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'getAmountByMonths transaction is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };
  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const keyword = req.query['keyword']?.toString() || '';
      const status = req.query['status']?.toString() || '';
      const transactionResult = await this.transactionService.getAll({keyword, status});
      res.status(200).json({
        statusCode: 200,
        statusText: 'GetAll transaction is successful.',
        totalCount: 0,
        page: 0,
        data: transactionResult
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'GetAll transaction is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const transactionResult = await this.transactionService.getById(req.params.id);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Get transaction is successful.',
        totalCount: 0,
        page: 0,
        data: transactionResult
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Get transaction is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = {
        ...req.body,
        idUser: new mongoose.Types.ObjectId(req.body['idUser'] as string || ''),
        createdBy: new mongoose.Types.ObjectId(req.body['createdBy'] as string || ''),
      };
      const transaction = await this.transactionService.create(body);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Create transaction is successful.',
        totalCount: 0,
        page: 0,
        data: transaction
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Create transaction is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public createMultiple = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = req.body['idUser'] || [];
      const transactions = users.map((id: string)=>( { 
        idUser: new mongoose.Types.ObjectId(id),      
        amount: req.body['amount'] || 0, 
        title: req.body['title'] || '',     
        content: req.body['content'] || '',    
        files: req.body['files'] || [],      
        status: req.body['status'] || 'OPEN',          
        type: req.body['type'] || 'RECHARGE',   
        createdBy: new mongoose.Types.ObjectId(req.body['created'] as string)
      }));
      const transactionsResult = await this.transactionService.insertManyItem(transactions);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Create multiple transaction is successful.',
        totalCount: 0,
        page: 0,
        data: transactionsResult
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Create transaction is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };
  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = {
        ...req.body,
        idUser: new mongoose.Types.ObjectId(req.body['idUser'] as string || ''),
        createdBy: new mongoose.Types.ObjectId(req.body['createdBy'] as string || ''),
      };
      const updatedResult = await this.transactionService.update(req.params.id, body);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Get transaction is successful.',
        totalCount: 0,
        page: 0,
        data: updatedResult
      });
      res.status(200).json();
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Get transaction is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.transactionService.delete(req.params.id);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Delete transaction is successful.',
        totalCount: 0,
        page: 0,
        data: result
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Delete transaction is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

}