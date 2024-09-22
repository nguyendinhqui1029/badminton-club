
import mongoose from 'mongoose';
import AttendanceModel, { Attendance } from '../models/attendance.model';

class AttendanceService {
  public async getByIdUser(id: mongoose.Types.ObjectId, fromDate: string, toDate?: string): Promise<Attendance[]> {
    const startOfDay = new Date(fromDate);
    const endOfDay = toDate ? new Date(toDate) : new Date(startOfDay);
    if(!toDate) {
      endOfDay.setDate(endOfDay.getDate() + 1);
    }
    return await AttendanceModel.find({idUser: id, createdAt:{
      $gte: startOfDay,
      $lt: endOfDay
    }});
  }

  public async getAllByCreatedDate(createdDate: string): Promise<Attendance[]> {
    const startOfDay = new Date(createdDate);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    return await AttendanceModel.find({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    });
  }

  public async getAll(): Promise<Attendance[]> {
    return await AttendanceModel.find();
  }

  public async getById(id: string): Promise<Attendance | null> {
    return await AttendanceModel.findById(id);
  }

  public async create(attendance: Attendance): Promise<Attendance> {
    return await AttendanceModel.create(attendance);
  }

  public async update(id: string, attendance: Attendance): Promise<Attendance | null> {
    return await AttendanceModel.findByIdAndUpdate(id, attendance, { new: true });
  }

  public async delete(id: string): Promise<Attendance | null> {
    return await AttendanceModel.findByIdAndDelete(id, { new: true });
  }
}

export default AttendanceService;