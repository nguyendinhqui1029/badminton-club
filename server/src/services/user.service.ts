import { hashPassword } from "../utils/common.util";
import  UserModel, { User } from "../models/user.model";
import bcrypt from 'bcrypt';
import env from '../config/env';
import jwt, { JwtPayload, VerifyErrors }  from 'jsonwebtoken';

class UserService {
  public async getAllUsers(): Promise<any[]> {
    const users = await UserModel.find();
    return users;
  }

  public async getUserById(id: string): Promise<any | null> {
    const user = await UserModel.findById(id);
    return user;
  }

  public async createUser(userData: User): Promise<User> {
    const hashedPassword = await hashPassword(userData.password);
    const newUser = await UserModel.create({...userData, password: hashedPassword});
    return newUser;
  }

  public async updateUser(id: string, userData: User): Promise<User | null> {
    const hashedPassword = await hashPassword(userData.password);
    const updatedUser = await UserModel.findByIdAndUpdate(id, {...userData, password: hashedPassword}, { new: true });
    return updatedUser;
  }

  public async deleteUser(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  public async login(account: {email: string; password: string}): Promise<Record<string, string>> {
    try {
      const user = await UserModel.findOne({ email: account.email });
      if (!user) {
        return { code: '401', message: 'Invalid username or password' };
      }
  
      // So sánh mật khẩu
      const isMatch = await bcrypt.compare(account.password, user.password);
      if (!isMatch) {
        return {code: '401', message: 'Invalid username or password' };
      }
  
      // Tạo JWT
      const accessToken = jwt.sign({ id: user._id, email: user.email, role: user.role }, env.JWT_SECRET, { expiresIn: '1h' });
      const refreshToken = jwt.sign({ id: user._id, email: user.email, role: user.role }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

      // Gửi token về client
      return { code: '200', accessToken, refreshToken};
    } catch (error) {
      console.error('Error logging in:', error);
      return { code: '500', message: 'Internal server error' };
    }
  }

  public async refreshToken(refreshToken: string): Promise<Record<string, string>> {
    try {
      const verifySuccess:JwtPayload = await jwt.verify(refreshToken, env.JWT_REFRESH_SECRET)  as JwtPayload;
      // Tạo access token mới
      const accessToken = jwt.sign({ id: verifySuccess['id'], email: verifySuccess['email'], role: verifySuccess['role'] }, env.JWT_SECRET, { expiresIn: '1h' });
      return {code: '200', accessToken};
    } catch (error) {
      console.error('Error logging in:', error);
      return { code: '403', message: 'Refresh Token is invalid' };
    }
  }
}

export default UserService;