import { taskCheckAttendance, taskInitAttendance } from "../cron-jobs/cronJobs";
import SettingsModel, { Settings } from "../models/settings.model";
import cron from 'node-cron';
import AttendanceService from "./attendance.service";

class SettingsService {
  private taskCheckAttendance!: cron.ScheduledTask;
  private taskInitAttendance: cron.ScheduledTask[] = [];

  private attendanceService: AttendanceService;
  
  constructor() {
    this.attendanceService= new AttendanceService();
  }
  public async getSetting(): Promise<Settings | null> {
    return await SettingsModel.findOne();
  }

  private async attendanceManagement() {
    const settingsConfig = await this.getSetting();
    if(this.taskInitAttendance.length) {
      this.taskInitAttendance.forEach(item=>item && item.stop());
    }

    if(settingsConfig && settingsConfig.requiredCheckInTime.length) {
      settingsConfig.requiredCheckInTime.forEach(item=>{
        const days: Record<string, number> = {
          T2: 1,
          T3: 2,
          T4: 3,
          T5: 4,
          T6: 5,
          T7: 6,
          CN: 7
        };
        const date: Date = new Date(item.startTime);
        date.setHours(new Date(item.startTime).getHours() - 2);
        this.taskInitAttendance.push(taskInitAttendance(`0 ${date.getHours()} * * ${days[item.dayOfWeek]}`,() => {
          console.log('initializeAttendance cronjob run')
          this.attendanceService.initializeAttendance();
        }));
      });
    }
  }

  public async create(settings: Settings): Promise<Settings>  {
    const result = await SettingsModel.create(settings);
    if(result && result.requiredCheckInTime.length) {
      this.attendanceManagement();
    }
    return await SettingsModel.create(settings);
  }

  public async update(id: string, settings: Settings): Promise<Settings | null> {
    const result = await SettingsModel.findByIdAndUpdate(id, {$set: settings}, { new: true });
    if(result && result.requiredCheckInTime.length) {
      this.attendanceManagement();
    }
    return result;
  }

  public async delete(id: string): Promise<Settings | null> {
    return await SettingsModel.findByIdAndDelete(id, { new: true });
  }
}

export default SettingsService;