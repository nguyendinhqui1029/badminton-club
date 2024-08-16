import CommentService from '../services/comment.service';
import { Request, Response } from 'express';

export default class CommentController {
  private commentService: CommentService;

  constructor() {
    this.commentService = new CommentService();
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const commentResult = await this.commentService.getAll();
      res.status(200).json(commentResult);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const commentResult = await this.commentService.getById(req.params.id);
      res.status(200).json(commentResult);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const comment = await this.commentService.create(req.body);
      res.status(201).json(comment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedResult = await this.commentService.update(req.params.id, req.body);
      res.status(200).json(updatedResult);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.commentService.delete(req.params.id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

}