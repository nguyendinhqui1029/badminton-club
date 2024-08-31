import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { paymentStatus } from '@app/constants/common.constant';
import { PaymentCard } from '@app/models/payment-card.model';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-payment-card',
  standalone: true,
  imports: [PanelModule, ButtonModule, CurrencyPipe],
  templateUrl: './payment-card.component.html',
  styleUrl: './payment-card.component.scss'
})
export class PaymentCardComponent {
  paymentInfo = input.required<PaymentCard>();
  isNotifyButton = input(false);
  isHiddenQrButton = input(false);
  paymentStatus = paymentStatus;
  displayStatus: Record<string, string> = {
    [this.paymentStatus.WAITING]: 'Chờ đóng',
    [this.paymentStatus.DONE]: 'Đã đóng',
    [this.paymentStatus.LATE]: 'Trễ',
  }

  openScanQrCode() {
    console.log('Scan Qr Code');
  }
}
