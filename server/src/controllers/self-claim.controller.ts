import SelfClaimService from '../services/self-claim.service';
import { Request, Response } from 'express';

export default class SelfClaimController {
  private selfClaimService: SelfClaimService;

  constructor() {
    this.selfClaimService = new SelfClaimService();
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const selfClaimResult = await this.selfClaimService.getAll();
      res.status(200).json(selfClaimResult);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const selfClaimResult = await this.selfClaimService.getById(req.params.id);
      res.status(200).json(selfClaimResult);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const selfClaim = await this.selfClaimService.create(req.body);
      res.status(201).json(selfClaim);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedResult = await this.selfClaimService.update(req.params.id, req.body);
      res.status(200).json(updatedResult);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.selfClaimService.delete(req.params.id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

}