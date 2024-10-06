
import mongoose from 'mongoose';
import RewardModel, { Reward } from '../models/rewards.model';

class RewardService {

  public async getById(id: mongoose.Types.ObjectId): Promise<Reward | null> {
    return await RewardModel.findById(id);
  }

 

  public async getAll(params?: {limit: number, skip: number}): Promise<Reward[]> {
    const limit = params?.limit || 10000;
    const skip = params?.skip ? (params?.skip - 1) * params?.limit : 0;
    return await RewardModel.find().skip(skip).limit(limit);
  }


  public async create(reward: Reward): Promise<Reward> {
    return await RewardModel.create(reward);
  }

  public async update(id: string, reward: Reward): Promise<Reward | null> {
    return await RewardModel.findByIdAndUpdate(id, reward, { new: true });
  }

  public async delete(id: string): Promise<Reward | null> {
    return await RewardModel.findByIdAndDelete(id, { new: true });
  }
}

export default RewardService;