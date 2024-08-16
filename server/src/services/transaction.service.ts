import TransactionModel, { Transaction } from "../models/transaction.model";


class TransactionService {
  public async getAll(): Promise<Transaction[]> {
    return await TransactionModel.find().populate('idUser');
  }

  public async getById(id: string): Promise<Transaction | null> {
    return await TransactionModel.findById(id).populate('idUser');
  }

  public async create(transaction: Transaction): Promise<Transaction> {
    return await TransactionModel.create(transaction);
  }

  public async update(id: string, transaction: Transaction): Promise<Transaction | null> {
    return await TransactionModel.findByIdAndUpdate(id, transaction, { new: true });
  }

  public async delete(id: string): Promise<Transaction | null> {
    return await TransactionModel.findByIdAndDelete(id, { new: true });
  }
}

export default TransactionService;