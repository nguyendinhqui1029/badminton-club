import SelfClaimModel, { SelfClaim } from "../models/self-claim.model";

class SelfClaimService {
  public async getAll(): Promise<SelfClaim[]> {
    return await SelfClaimModel.find().populate('idAttendance').populate('idUserAccept').populate('idUserReject').exec();
  }

  public async getById(id: string): Promise<SelfClaim | null> {
    return await SelfClaimModel.findById(id).populate('idAttendance').populate('idUserAccept').populate('idUserReject').exec();;
  }

  public async create(selfClaim: SelfClaim): Promise<SelfClaim> {
    return await SelfClaimModel.create(selfClaim);
  }

  public async update(id: string, selfClaim: SelfClaim): Promise<SelfClaim | null> {
    return await SelfClaimModel.findByIdAndUpdate(id, selfClaim, { new: true });
  }

  public async delete(id: string): Promise<SelfClaim | null> {
    return await SelfClaimModel.findByIdAndDelete(id, { new: true });
  }
}

export default SelfClaimService;