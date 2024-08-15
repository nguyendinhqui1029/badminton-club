
import AttendanceModel, { Attendance } from '../models/attendance.model';

class AttendanceService {
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