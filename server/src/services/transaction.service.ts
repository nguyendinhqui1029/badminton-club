import mongoose from "mongoose";
import TransactionModel, { Transaction } from "../models/transaction.model";
import { transactionStatus, transactionType } from "../constants/common.constants";


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
          $addFields: {
            user: {
              $filter: {
                input: '$user',
                as: 'user',
                cond: {
                  $regexMatch: {
                    input: { $toLower: '$$user.name' },
                    regex: new RegExp(query.keyword, 'i')
                  }
                }
              }
            }
          }
        },
        {
          $match: {
            user: { $ne: [] } // Remove documents where user does not match
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
            createdBy: 1,
            user: {
              _id: 1,
              name: 1,
              avatar: 1
            }
          }
        }
      ]).exec();
      return transactions;
    } catch (error) {
      console.error('Error finding transactions:', error);
    }
  }

  public async getAmountByMonths(date: {year: number, month: number}[]) {
    const objectAmountByMonth: Record<string, {recharge: number, withdraw: number}> = {};
    for(let index=0; index<date.length; index++) {
      const startDate = new Date(date[index].year, date[index].month - 1, 1); // Ngày đầu tháng
      const endDate = new Date(date[index].year, date[index].month, 0, 23, 59, 59, 999); // Ngày cuối tháng

      const rechargeResult = await TransactionModel.aggregate<{totalAmount: number}>([
          {
              $match: {
                  createdAt: {
                      $gte: startDate,
                      $lte: endDate
                  },
                  type: transactionType.RECHARGE,
                  status: transactionStatus.DONE
              }
          },
          {
              $group: {
                  _id: '$type', // Nhóm theo trường status
                  totalAmount: { $sum: '$amount' } // Tính tổng trường amount
              }
          }
      ]);

      const withdrawResult = await TransactionModel.aggregate<{totalAmount: number}>([
        {
            $match: {
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                },
                type: transactionType.WITHDRAW,
                status: transactionStatus.DONE
            }
        },
        {
            $group: {
                _id: '$type', // Nhóm theo trường status
                totalAmount: { $sum: '$amount' } // Tính tổng trường amount
            }
        }
      ]);

      objectAmountByMonth[`${date[index].year}_${date[index].month}`] = { recharge: rechargeResult.length > 0 ? rechargeResult[0].totalAmount : 0, withdraw: withdrawResult.length > 0 ? withdrawResult[0].totalAmount : 0};
    }
    
    return objectAmountByMonth;
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