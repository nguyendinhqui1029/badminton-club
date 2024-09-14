import mongoose from "mongoose";
import CommentModel, { Comment } from "../models/comment.model";
import PostModel from "../models/post.model";

class CommentService {
  public async getAll(): Promise<Comment[]> {
    return await CommentModel.find().populate('idUser').populate('idRootComment').exec();
  }

  public async getByIdPost(id: string): Promise<Comment[] | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid post ID format');
    }
    return await CommentModel.find({idPost: new mongoose.Types.ObjectId(id), status: 'APPROVED'}).populate('idUser', 'id avatar name').populate('idRootComment', 'id').exec();
  }

  public async create(comment: Comment): Promise<Comment | void> {
    try {
      const addCommentResult = await CommentModel.create(comment);
      if(addCommentResult) {
        const count = await CommentModel.countDocuments({ idPost: new mongoose.Types.ObjectId(comment.idPost) });
        await PostModel.findByIdAndUpdate(new mongoose.Types.ObjectId(comment.idPost), {$set: {countComment: count}});
      }
      return addCommentResult;
    } catch (err) {
      console.error('Error counting comments', err);
      return ;
    }
  }

  public async update(id: string, comment: Comment): Promise<Comment | null> {
    return await CommentModel.findByIdAndUpdate(id, comment, { new: true });
  }

  public async delete(id: string): Promise<Comment | null> {
    return await CommentModel.findByIdAndDelete(id, { new: true });
  }
}

export default CommentService;