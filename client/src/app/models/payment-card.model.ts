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
  qrLink: string;       
  idUser: string;       
  secretKey: string;   
  totalAmount: number;  
  amount: number;       
  content: string;      
  files: string[];      
  status: string;       
  type:  'RECHARGE' | 'WITHDRAW';
  createdAt: string;
}