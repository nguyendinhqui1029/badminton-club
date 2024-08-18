import PostModel, { Post } from "../models/post.model";

class PostService {
  public async getAll(): Promise<Post[]> {
    return await PostModel.find().populate('idUserLike').populate('idComment');
  }

  public async getById(id: string): Promise<Post | null> {
    return await PostModel.findById(id).populate('createdBy','id name avatar').populate('idUserLike').populate('idComment').populate('tagFriends', 'name id');
  }

  public async create(Post: Post): Promise<Post> {
    return await PostModel.create(Post);
  }

  public async update(id: string, Post: Post): Promise<Post | null> {
    return await PostModel.findByIdAndUpdate(id, Post, { new: true });
  }

  public async delete(id: string): Promise<Post | null> {
    return await PostModel.findByIdAndDelete(id, { new: true });
  }
}

export default PostService;