import PostService from '../services/post.service';
import { Request, Response } from 'express';

export default class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const postResult = await this.postService.getAll();
      res.status(200).json(postResult);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const postResult = await this.postService.getById(req.params.id);
      res.status(200).json(postResult);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const post = await this.postService.create(req.body);
      res.status(201).json(post);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedResult = await this.postService.update(req.params.id, req.body);
      res.status(200).json(updatedResult);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.postService.delete(req.params.id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

}