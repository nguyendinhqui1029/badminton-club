import CommentModel, { Comment } from "../models/comment.model";

class CommentService {
  public async getAll(): Promise<Comment[]> {
    return await CommentModel.find().populate('idUser').populate('idRootComment').exec();
  }

  public async getById(id: string): Promise<Comment | null> {
    return await CommentModel.findById(id).populate('idUser').populate('idRootComment').exec();;
  }

  public async create(comment: Comment): Promise<Comment> {
    return await CommentModel.create(comment);
  }

  public async update(id: string, comment: Comment): Promise<Comment | null> {
    return await CommentModel.findByIdAndUpdate(id, comment, { new: true });
  }

  public async delete(id: string): Promise<Comment | null> {
    return await CommentModel.findByIdAndDelete(id, { new: true });
  }
}

export default CommentService;