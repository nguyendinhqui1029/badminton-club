import { UserInfoSearch } from "./user.model";

export interface PaymentDetail {
  name: string;
  amount: number;
}
export interface PaymentCard {
  id: string;
  userName: string;
  total: number;
  status: string;
  createdAt: string;
  detail: PaymentDetail[];
}

export interface PaymentResponseValue {
  id: string;
  user: UserInfoSearch[];      
  title: string;  
  amount: number;       
  content: string;      
  files: string[];      
  status: string;       
  type:  'RECHARGE' | 'WITHDRAW';
  createdAt: string;
  updatedAt: string;
  createdBy: UserInfoSearch[];
}

export interface PaymentRequestBody {
  idUser: string[];       
  amount: number; 
  title: string;     
  content: string;      
  files: string[];     
  status: string;     
  type: string;
  createdBy: string;
}