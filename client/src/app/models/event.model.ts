export interface EventRequestBody {
  id: string;
  name: string;
  type?: string;
  address?: string;
  expectedBudget: number;
  startDate?: string;
  endDate?: Date;
  description: string;
  thumbnail: string;
  toUser: string[];
  status: 'ON'|'EXPIRE'|'WAITING'|'OFF';
}

export interface EventResponseValue {
  id: string;
  name: string;
  type?: string;
  address?: string;
  expectedBudget: number;
  startDate?: string;
  endDate?: Date;
  description: string;
  thumbnail: string;
  status: 'ON'|'EXPIRE'|'WAITING'|'OFF';
}