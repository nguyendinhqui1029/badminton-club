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
      res.status(200).json({
        statusCode: 200,
        statusText: 'Get Post is successful.',
        totalCount: 0,
        page: 0,
        data: postResult 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Get post is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const postResult = await this.postService.getById(req.params.id);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Get Post by id is successful.',
        totalCount: 0,
        page: 0,
        data: postResult 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Get post is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const post = await this.postService.create(req.body);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Create post is successful.',
        totalCount: 0,
        page: 0,
        data: post 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Create post is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedResult = await this.postService.update(req.params.id, req.body);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Update post is successful.',
        totalCount: 0,
        page: 0,
        data: updatedResult 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Update post is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.postService.delete(req.params.id);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Delete post is successful.',
        totalCount: 0,
        page: 0,
        data: result 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Delete post is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

}