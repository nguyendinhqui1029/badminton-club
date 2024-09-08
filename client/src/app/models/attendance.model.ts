export interface Attendance {
  id: string;
  amount: number;
  isUser: string;
  checkIn: string;
  checkout: string;
  status: 'LATE' | 'ON_TIME' | 'OFF';
  createdAt: Date;
  updatedAt: Date;
}