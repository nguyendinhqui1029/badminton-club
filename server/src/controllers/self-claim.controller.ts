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
      res.status(200).json({
        statusCode: 200,
        statusText: 'getAll is success.',
        totalCount: 0,
        page: 0,
        data: selfClaimResult
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'getAll is success.',
        totalCount: 0,
        page: 0,
        data: error
      });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const selfClaimResult = await this.selfClaimService.getById(req.params.id);
      res.status(200).json({
        statusCode: 200,
        statusText: 'getById is success.',
        totalCount: 0,
        page: 0,
        data: selfClaimResult
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'getById is success.',
        totalCount: 0,
        page: 0,
        data: error
      });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const selfClaim = await this.selfClaimService.create(req.body);
      res.status(200).json({
        statusCode: 200,
        statusText: 'create is success.',
        totalCount: 0,
        page: 0,
        data: selfClaim
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'create is success.',
        totalCount: 0,
        page: 0,
        data: error
      });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedResult = await this.selfClaimService.update(req.params.id, req.body);
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
        statusText: 'update is success.',
        totalCount: 0,
        page: 0,
        data: error
      });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.selfClaimService.delete(req.params.id);
      res.status(200).json({
        statusCode: 200,
        statusText: 'update is success.',
        totalCount: 0,
        page: 0,
        data: result
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'update is success.',
        totalCount: 0,
        page: 0,
        data: error
      });
    }
  };

}