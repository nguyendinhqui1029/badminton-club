import { hashPassword } from "../utils/common.util";
import UserModel, { User } from "../models/user.model";
import bcrypt from 'bcrypt';
import env from '../config/env';
import jwt, { JwtPayload } from 'jsonwebtoken';
import mongoose from "mongoose";
import EmailService from "./email.service";

class UserService {
  public async searchAllUsers(idUser: string, keyword: string): Promise<any[]> {
    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(idUser) // Find the user by ID
        }
      },
      {
        $lookup: {
          from: 'users', // Collection name in MongoDB
          localField: 'idFriends',
          foreignField: '_id',
          as: 'friends'
        }
      },
      {
        $unwind: {
          path: '$friends',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          'friends._id': { $ne: new mongoose.Types.ObjectId(idUser) },
          $or: [
            {
              'friends.name': { $regex: keyword, $options: 'i' }
            },
            {
              $expr: { $eq: [keyword, ''] }
            }
          ]
        }
      },
      {
        $project: {
          'name': 1,
          'avatar': 1,
          'friends._id': 1,
          'friends.name': 1,
          'friends.avatar': 1
        }
      }
    ];
    try {
      const result = await UserModel.aggregate(pipeline).exec();
      return result;
    } catch (error) {
      console.error('Error in searchAllUsers:', error);
      throw new Error('Failed to search users');
    }
  }

  public async getAllUsers(): Promise<User[]> {
    const users = await UserModel.find();
    return users;
  }

  public async getUserById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    return user;
  }

  public async createUser(userData: User): Promise<User> {
    const hashedPassword = await hashPassword(userData.password);
    const idFriendObjectList = userData.idFriends.map((id: string) => new mongoose.Types.ObjectId(id));
    const newUser = await UserModel.create({ ...userData, idFriends: idFriendObjectList, password: hashedPassword });
    return newUser;
  }

  public async updateUser(id: string, userData: User): Promise<User | null> {
    const hashedPassword = await hashPassword(userData.password);
    const idFriendObjectList = userData.idFriends.map((idFriend: string) => new mongoose.Types.ObjectId(idFriend));
    const updatedUser = await UserModel.findByIdAndUpdate(id, { ...userData, idFriends: idFriendObjectList, password: hashedPassword }, { new: true });
    return updatedUser;
  }

  public async deleteUser(id: string): Promise<User | null> {
    return await UserModel.findByIdAndDelete(id, { new: true });
  }

  public async login(account: { phone: string; password: string}): Promise<Record<string, string>> {
    try {
      const user = await UserModel.findOne({ phone: account.phone });
      if (!user) {
        return { code: '402', message: 'Invalid username or password' };
      }

      // So sánh mật khẩu
      const isMatch = await bcrypt.compare(account.password, user.password);
      if (!isMatch) {
        return { code: '402', message: 'Invalid username or password' };
      }

      // Tạo JWT
      const accessToken = jwt.sign({ id: user._id, name: user.name, point: user.point, avatar: user.avatar, email: user.email, phone: user.phone,  role: user.role }, env.JWT_SECRET, { expiresIn: '1h' });
      const refreshToken = jwt.sign({ id: user._id, name: user.name, point: user.point, avatar: user.avatar, email: user.email, phone: user.phone, role: user.role}, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    
      // Gửi token về client
      return { code: '200', accessToken, refreshToken };
    } catch (error) {
      console.error('Error logging in:', error);
      return { code: '500', message: 'Internal server error' };
    }
  }

  public async refreshToken(refreshToken: string): Promise<Record<string, string>> {
    try {
      const verifySuccess: JwtPayload = await jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload;
      // Tạo access token mới
      const accessToken = jwt.sign({ id: verifySuccess['id'], name: verifySuccess?.name, phone: verifySuccess.phone, point: verifySuccess?.point, avatar: verifySuccess?.avatar, email: verifySuccess['email'], role: verifySuccess['role'] }, env.JWT_SECRET, { expiresIn: '1h' });
      return { code: '200', accessToken };
    } catch (error) {
      console.error('Error logging in:', error);
      return { code: '403', message: 'Refresh Token is invalid' };
    }
  }

  public async resetPassword(email: string, newPassword: string, code: string): Promise<Record<string, string | User | null>> {
    const verifyCodeValid = await EmailService.sendVerifyCodeByEmailTo(email, code);
    if(verifyCodeValid && verifyCodeValid.id) {
      const deleteEmailByIdResult = await EmailService.deleteEmailById(verifyCodeValid.id);
      if(!deleteEmailByIdResult) {
        return { code: '500', data: 'Service error.' };
      }
      const hashedPassword = await hashPassword(newPassword);
      const updatedUser = await UserModel.findOneAndUpdate({ email }, {password: hashedPassword}, {
        fields: '_id phone',
        new: true, // Trả về bản ghi mới sau khi cập nhật
        runValidators: true // Chạy các validator để đảm bảo dữ liệu hợp lệ
      }).exec();
      return { code: '200', data: updatedUser };
    }
   return { code: '405', data: 'Code is invalid or Code is expired.' };
  }
}

export default UserService;