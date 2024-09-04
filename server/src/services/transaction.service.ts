import mongoose from "mongoose";
import TransactionModel, { Transaction } from "../models/transaction.model";


class TransactionService {
  public async getAll(query: {keyword: string, status: string}): Promise<Transaction[] | void> {
    try {
      const transactions = await TransactionModel.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'idUser',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdBy'
          }
        },
        {
          $match: {
            // Only include title filter if keyword is provided
            ...(query.keyword ? {
              title: {
                $regex: new RegExp(query.keyword, 'i') // Case-insensitive regex for title
              }
            } : {}),
            // Only include status filter if status is provided
            ...(query.status ? {
              status: query.status // Filter by status
            } : {})
          }
        },
        {
          $addFields: {
            user: {
              $cond: {
                if: query.keyword ? {
                  $regexMatch: {
                    input: { $toLower: '$user.name' },
                    regex: new RegExp(query.keyword.toLowerCase(), 'i')
                  }
                } : true, // Always true if keyword is not provided
                then: '$user',
                else: null
              }
            }
          }
        },
        {
          $match: {
            user: { $ne: null } // Remove documents where user does not match
          }
        },
        {
          $project: {
            title: 1,
            amount: 1,
            status: 1,
            type: 1,
            content: 1,
            files: 1,
            createdAt: 1,
            user: {
              _id: 1,
              name: 1,
              avatar: 1
            },
            createdBy: {
              _id: 1,
              name: 1,
              email: 1 // Include additional fields if needed
            }
          }
        }
      ]).exec();
      return transactions;
    } catch (error) {
      console.error('Error finding transactions:', error);
    }
  }

  public async getById(id: string): Promise<Transaction | null> {
    return await TransactionModel.findById(id).populate('idUser');
  }

  public async create(transaction: Transaction): Promise<Transaction> {
    return await TransactionModel.create(transaction);
  }

  public async insertManyItem(transactions: Transaction[]): Promise<Transaction[]> {
    return await TransactionModel.insertMany(transactions);
  }
  public async update(id: string, transaction: Transaction): Promise<Transaction | null> {
    return await TransactionModel.findByIdAndUpdate(id, transaction, { new: true });
  }

  public async delete(id: string): Promise<Transaction | null> {
    return await TransactionModel.findByIdAndDelete(id, { new: true });
  }
}

export default TransactionService;