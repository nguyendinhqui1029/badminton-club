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
        statusCode: 200,
        statusText: 'Get user is successful.',
        totalCount: 0,
        page: 0,
        data: deletedUser
      });
    } catch (error: any) {
      res.status(200).json({code: 500, message: error.message });
    }
  };

  public login= async (req: Request, res: Response): Promise<void> => {
    try {
      const loginInfo = await this.userService.login({phone: req.body['phone'], password: req.body['password']});
      if(loginInfo.code === '402') {
        res.status(200).json({
          statusCode: 402,
          statusText: 'Login is error.',
          totalCount: 0,
          page: 0,
          data: loginInfo.message
        });
        return;
      }
      if(loginInfo.code === '200') {
        const maxAge = req.body['isRememberMe'] ? 30 * 24 * 60 * 60 * 1000 : 1 * 24 * 60 * 60 * 1000; // 30 ngày hoặc 1 ngày

        // Gửi cookie với thuộc tính HttpOnly
        res.cookie('authToken', loginInfo.accessToken, {
          httpOnly: true, // Cookie không thể được truy cập từ JavaScript
          secure: process.env.NODE_ENV === 'PRO', // Cookie chỉ được gửi qua HTTPS trong môi trường sản xuất
          maxAge // Thời gian sống của cookie
        });
        res.status(200).json({
          statusCode: 200,
          statusText: 'Login is successful.',
          totalCount: 0,
          page: 0,
          data:  {accessToken: loginInfo.accessToken, refreshToken: loginInfo.refreshToken}
        });
        return;
      }
    } catch (error: any) {
      res.status(200).json({statusCode: 500, message: error.message });
    }
  };

  public refreshToken = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({
          statusCode: 200,
          statusText: 'Refresh token is required',
          totalCount: 0,
          page: 0,
          data: null
        });
      return;
    }
    const refreshTokenInfo = await this.userService.refreshToken(refreshToken);

    if(refreshTokenInfo.code === '403') {
      res.status(403).json({
        statusCode: 403,
        statusText: refreshTokenInfo.message,
        totalCount: 0,
        page: 0,
        data: null
      });
      return;
    }
    if(refreshTokenInfo.code === '200') {
      res.status(200).json({
        statusCode: 200,
        statusText: 'Refresh Token Info is successful.',
        totalCount: 0,
        page: 0,
        data: {accessToken: refreshTokenInfo.accessToken}
      });
      return;
    }
  };

  public logout  =(req: Request, res: Response) => {
    res.clearCookie('authToken');
    res.status(200).json({
      statusCode: 200,
      statusText: 'Logout is successful.',
      totalCount: 0,
      page: 0,
      data: null
    });
  };

  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const email=req.body['email'];
      const newPassword=req.body['password'];
      const code=req.body['code'];
      const resetPasswordResult = await this.userService.resetPassword(email, newPassword, code);
      res.status(200).json({
        statusCode: Number(resetPasswordResult.code),
        statusText: Number(resetPasswordResult.code) !== 200 ? resetPasswordResult.data : 'Reset password success',
        totalCount: 0,
        page: 0,
        data: resetPasswordResult.data
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Reset password is fail.',
        totalCount: 0,
        page: 0,
        data: error.message
      });
    }
  };
}

export default UserController;