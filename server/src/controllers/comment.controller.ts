import CommentService from '../services/comment.service';
import { Request, Response } from 'express';

export default class CommentController {
  private commentService: CommentService;

  constructor() {
    this.commentService = new CommentService();
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.query['id']?.toString() || '';
      const commentResult = await this.commentService.getByIdPost(id);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Get Comment is successful.',
        totalCount: 0,
        page: 0,
        data: commentResult 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Get Comment is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  // public getById = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const commentResult = await this.commentService.getByIdPost(req.params.id);
  //     res.status(200).json({
  //       statusCode: 200,
  //       statusText: 'Get Comment is successful.',
  //       totalCount: 0,
  //       page: 0,
  //       data: commentResult 
  //     });
  //   } catch (error: any) {
  //     res.status(200).json({
  //       statusCode: 500,
  //       statusText: 'Get Comment is fail.',
  //       totalCount: 0,
  //       page: 0,
  //       data: error.message
  //     });
  //   }
  // };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const comment = await this.commentService.create(req.body);
      res.status(200).json({
        statusCode: 200,
        statusText: 'create Comment is successful.',
        totalCount: 0,
        page: 0,
        data: comment 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'create Comment is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedResult = await this.commentService.update(req.params.id, req.body);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Update Comment is successful.',
        totalCount: 0,
        page: 0,
        data: updatedResult 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'create Comment is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.commentService.delete(req.params.id);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Delete Comment is successful.',
        totalCount: 0,
        page: 0,
        data: result 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Delete Comment is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

}