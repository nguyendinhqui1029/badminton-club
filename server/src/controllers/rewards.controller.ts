import mongoose from 'mongoose';
import { Request, Response } from 'express';
import RewardService from '../services/reward.service';

export default class RewardController {
  private rewardService!: RewardService;
  constructor() {
    this.rewardService = new RewardService();
  }
  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const rewardResult = await this.rewardService.getById(new mongoose.Types.ObjectId(req.params['id']));
      res.status(200).json({
        statusCode: 200,
        statusText: 'Get RewardService is successful.',
        totalCount: 0,
        page: 0,
        data: rewardResult
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Get RewardService is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public getAll= async (req: Request, res: Response): Promise<void> => {
    try {
      const params = {
        limit: +(req.query['limit']?.toString() || 1000), 
        skip: +(req.query['skip']?.toString() || 0)
      };
      const rewardResult = await this.rewardService.getAll(params);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Get RewardService is successful.',
        totalCount: 0,
        page: 0,
        data: rewardResult
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Get RewardService is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const reward = await this.rewardService.create(req.body);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Create reward is successful.',
        totalCount: 0,
        page: 0,
        data: reward
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Create reward is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedResult = await this.rewardService.update(req.params.id, req.body);
      res.status(200).json({
        statusCode: 200,
        statusText: 'update reward is successful.',
        totalCount: 0,
        page: 0,
        data: updatedResult
      });
      res.status(200).json();
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'update reward is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.rewardService.delete(req.params.id);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Delete reward is successful.',
        totalCount: 0,
        page: 0,
        data: result
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Delete reward is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

}