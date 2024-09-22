export interface Attendance {
  id: string;
  amount: number;
  idUser: string;
  checkIn: string;
  checkout: string;
  status: 'LATE' | 'ON_TIME' | 'OFF' | 'DONE' | 'WAITING' | 'EARLY';
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceResponseValue {
  id: string;
  amount: number;
  idUser: string;
  checkIn: string;
  checkout: string;
  status: 'LATE' | 'ON_TIME' | 'OFF' | 'DONE' | 'WAITING' | 'EARLY';
  createdAt: Date;
  updatedAt: Date;
}