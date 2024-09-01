import { Component, signal } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CommonOption } from '@app/models/common-option.model';
import { ButtonModule } from 'primeng/button';
import { PaymentCardComponent } from '@app/components/payment-card/payment-card.component';
import { PaymentCard } from '@app/models/payment-card.model';
import { paymentStatus } from '@app/constants/common.constant';
@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [TabViewModule, PanelModule, DropdownModule, InputTextModule, ButtonModule, PaymentCardComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  statusOptions: CommonOption[] = [
    {
      label: 'Tất cả',
      value: 'All'
    },
    {
      label: 'Chờ đóng',
      value: 'Waiting'
    },
    {
      label: 'Đã đóng',
      value: 'Done'
    },
    {
      label: 'Đóng trễ',
      value: 'Late'
    }
  ];
  paymentInfo: PaymentCard = {
    createdAt: '31-08-2024',
    id: '1232',
    userName: 'Nguyễn Văn A',
    total: 10000,
    status: paymentStatus.WAITING,
    detail: [{
      name: 'Tiền sân',
      amount: 10000
    }]
  };
  isAdmin = signal<boolean>(true);
}
