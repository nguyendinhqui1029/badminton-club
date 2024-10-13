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
    const result =  await CommentModel.find({idPost: new mongoose.Types.ObjectId(id), status: 'APPROVED'}).populate('idUser', 'id avatar name').populate('idRootComment', 'id').exec();
    return (result || []).sort((firstComment: Comment, secondComment: Comment) => new Date(secondComment.createdAt).getTime() - new Date(firstComment.createdAt).getTime())
  }

  public async create(comment: Comment): Promise<{comment: Comment, total: number} | void> {
    try {
      const addCommentResult = await CommentModel.create(comment);
      let count = 0;
      if(addCommentResult) {
        count = await CommentModel.countDocuments({ idPost: new mongoose.Types.ObjectId(comment.idPost) });
        await PostModel.findByIdAndUpdate(new mongoose.Types.ObjectId(comment.idPost), {$set: {countComment: count}});
      }
      return { comment: addCommentResult, total: count };
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