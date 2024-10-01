import { getUTCDate } from "../utils/date.util";
import PostModel, { Post } from "../models/post.model";
import FileUploadController from "../controllers/upload-file.controller";
import { scopePost } from "../constants/common.constants";
import mongoose from "mongoose";
import UserService from "./user.service";

class PostService {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }
  public async getAll(idUser: string): Promise<Post[]> {
    const user = await this.userService.getUserById(idUser);
    const friendIds:string[] = user?.idFriends || [];
     const result = await PostModel.find({ $or: [
      { createdBy: new mongoose.Types.ObjectId(idUser) },
      { scope: scopePost.EVERYONE }, // Fetch public posts
      { scope: scopePost.ONLY_ME, createdBy: new mongoose.Types.ObjectId(idUser) },
      { scope: scopePost.FRIENDS, createdBy: {$in: friendIds}}
    ],}).populate('createdBy','id name avatar').populate('idUserLike', 'id name avatar').populate('tagFriends', 'name id avatar');
     return result.sort((firstPost: Post, secondPost: Post) => {
      return new Date(secondPost.createdAt).getTime() - new Date(firstPost.createdAt).getTime(); // Sắp xếp giảm dần
    });
  }

  public async getByName(name: string): Promise<Post[] | null> {
    const regex = new RegExp(name, 'i'); // 'i' là tùy chọn để tìm kiếm không phân biệt chữ hoa chữ thường
    return await PostModel.find({ content: { $regex: regex } });
  }

  public async getById(id: string): Promise<Post | null> {
    return await PostModel.findById(id).populate('createdBy','id name avatar').populate('idUserLike', 'id name avatar').populate('tagFriends', 'name id avatar');
  }

  public async create(Post: Post): Promise<Post | null> {
    const postCreated = await PostModel.create(Post);
    if(postCreated) {
      return this.getById(postCreated.id);
    }
    return postCreated;
  }

  public async update(id: string, post: Post): Promise<Post | null> {
    const result = await PostModel.findByIdAndUpdate(id, {...post, updatedAt: getUTCDate(new Date())}, { new: true });
    
    if(result) {
      return this.getById(id);
    }
    return result;
  }

  public async delete(id: string): Promise<Post | null> {
    const result = await PostModel.findByIdAndDelete(id, { new: true });

    if(result && result.images?.length) {
      const fileNames = result.images.map((item: string)=>item.substring(item.lastIndexOf('/') + 1));
      const deleteFileResponse = await FileUploadController.deleteFileUploadByIds(fileNames);
      if(deleteFileResponse.statusCode === 200) {
        return result;
      }
    }
    return result;
  }
}

export default PostService;