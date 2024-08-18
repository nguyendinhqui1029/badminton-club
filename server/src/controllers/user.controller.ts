import { Request, Response } from 'express';
import UserService from '../services/user.service';

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }
  public searchFriendUserByKeyword = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params['id'];
      const keyword = req.query['keyword']?.toString() || '';
      const users = await this.userService.searchAllUsers(id,keyword);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Get user is successful.',
        totalCount: 0,
        page: 0,
        data: users 
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Get user is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json({
        statusCode: 200,
        statusText: 'Get user is successful.',
        totalCount: 0,
        page: 0,
        data: users || []
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Get user is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Get user is successful.',
        totalCount: 0,
        page: 0,
        data: user || []
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Get user is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const newUser = await this.userService.createUser(req.body);
      res.status(201).json({
        statusCode: 201,
        statusText: 'Get user is successful.',
        totalCount: 0,
        page: 0,
        data: newUser
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Get user is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedUser = await this.userService.updateUser(req.params.id, req.body);
      res.status(201).json({
        statusCode: 201,
        statusText: 'Get user is successful.',
        totalCount: 0,
        page: 0,
        data: updatedUser
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Get user is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };

  public deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const deletedUser = await this.userService.deleteUser(req.params.id,);
      res.status(204).json({
        statusCode: 204,
        statusText: 'Get user is successful.',
        totalCount: 0,
        page: 0,
        data: deletedUser
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public login= async (req: Request, res: Response): Promise<void> => {
    try {
      const loginInfo = await this.userService.login({email: req.body['email'], password: req.body['password']});
      if(loginInfo.code === '401') {
        res.status(401).json({message: loginInfo.message});
        return;
      }
      if(loginInfo.code === '200') {
        res.status(200).json({accessToken: loginInfo.accessToken, refreshToken: loginInfo.refreshToken});
        return;
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public refreshToken = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({ message: 'Refresh token is required' });
      return;
    }
    const refreshTokenInfo = await this.userService.refreshToken(refreshToken);

    if(refreshTokenInfo.code === '403') {
      res.status(403).json({message: refreshTokenInfo.message});
      return;
    }
    if(refreshTokenInfo.code === '200') {
      res.status(200).json({accessToken: refreshTokenInfo.accessToken});
      return;
    }
  };
}

export default UserController;