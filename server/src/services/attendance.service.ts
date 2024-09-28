
import mongoose from 'mongoose';
import AttendanceModel, { Attendance } from '../models/attendance.model';
import UserService from './user.service';
import { User } from '../models/user.model';
import { accountType, userStatus } from '../constants/common.constants';

class AttendanceService {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }
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

  public async initializeAttendance() {
    const users = await  this.userService.getAllUsers(userStatus.ON);
    if(!users.length) {
      return;
    }
    const attendances: Attendance[] = [];
    users.forEach((item: User)=> {
      if(item?.accountType === accountType.FIXED_PLAYER) {
        attendances.push({
          amount: 0,
          idUser: item._id!,
          checkIn: null,
          checkout: null,
          participationDate: new Date(new Date().toUTCString())
        })
      }
    });
    return await AttendanceModel.insertMany(attendances)
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