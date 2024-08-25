import { getUTCDate } from "../utils/date.util";
import PostModel, { Post } from "../models/post.model";
import FileUploadController from "../controllers/upload-file.controller";

class PostService {
  public async getAll(): Promise<Post[]> {
     const result = await PostModel.find().populate('createdBy','id name avatar').populate('idUserLike').populate('idComment').populate('tagFriends', 'name id');
     return result.sort((firstPost: Post, secondPost: Post) => {
      return new Date(secondPost.updatedAt).getTime() - new Date(firstPost.updatedAt).getTime(); // Sắp xếp giảm dần
    });
  }

  public async getById(id: string): Promise<Post | null> {
    return await PostModel.findById(id).populate('createdBy','id name avatar').populate('idUserLike').populate('idComment').populate('tagFriends', 'name id');
  }

  public async create(Post: Post): Promise<Post> {
    return await PostModel.create(Post);
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