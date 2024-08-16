import TransactionService from '../services/transaction.service';
import { Request, Response } from 'express';

export default class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const transactionResult = await this.transactionService.getAll();
      res.status(200).json(transactionResult);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const transactionResult = await this.transactionService.getById(req.params.id);
      res.status(200).json(transactionResult);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const transaction = await this.transactionService.create(req.body);
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedResult = await this.transactionService.update(req.params.id, req.body);
      res.status(200).json(updatedResult);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.transactionService.delete(req.params.id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

}