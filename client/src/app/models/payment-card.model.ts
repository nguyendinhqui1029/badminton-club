export interface PaymentDetail {
  name: string;
  amount: number;
}
export interface PaymentCard {
  id: string;
  userName: string;
  total: number;
  status: string;
  detail: PaymentDetail[];
}