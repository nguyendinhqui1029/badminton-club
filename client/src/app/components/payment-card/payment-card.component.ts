import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, inject, input, OnDestroy, Output, PLATFORM_ID } from '@angular/core';
import { paymentStatus } from '@app/constants/common.constant';
import { PaymentCard } from '@app/models/payment-card.model';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PanelModule } from 'primeng/panel';
import { take } from 'rxjs';
import { ScanQrDialogComponent } from '@app/components/dialogs/scan-qr-dialog/scan-qr-dialog.component';

@Component({
  selector: 'app-payment-card',
  standalone: true,
  imports: [PanelModule, ButtonModule, CurrencyPipe],
  templateUrl: './payment-card.component.html',
  styleUrl: './payment-card.component.scss',
  providers: [DialogService, DynamicDialogRef]
})
export class PaymentCardComponent implements OnDestroy {
  @Output() refreshListEvent = new EventEmitter();

  paymentInfo = input.required<PaymentCard>();
  isNotifyButton = input(false);
  isHiddenQrButton = input(false);
  paymentStatus = paymentStatus;
  displayStatus: Record<string, string> = {
    [this.paymentStatus.WAITING]: 'Chờ đóng',
    [this.paymentStatus.DONE]: 'Đã đóng',
    [this.paymentStatus.LATE]: 'Trễ',
  }
  private dialogService: DialogService = inject(DialogService);
  private dynamicDialogQrCodeRef: DynamicDialogRef = inject(DynamicDialogRef);
  private platformId: Object = inject(PLATFORM_ID);

  openScanQrCode() {
    this.dynamicDialogQrCodeRef = this.dialogService.open(ScanQrDialogComponent, {
      showHeader: false,
      width: '450px',
      height: '100vh',
      modal: true,
      transitionOptions: '450ms',
      appendTo: 'body',
      data: {
        idPayment: this.paymentInfo().id
      }
    });

    if(isPlatformBrowser(this.platformId) && window.matchMedia('(max-width: 500px)').matches) {
      this.dialogService.getInstance(this.dynamicDialogQrCodeRef).maximize();
    }
    this.dynamicDialogQrCodeRef.onClose.pipe(take(1)).subscribe(()=>{
      this.refreshListEvent.emit();
    });
  }

  ngOnDestroy() {
    if (this.dynamicDialogQrCodeRef) {
      this.dynamicDialogQrCodeRef.close();
    } 
  }
}
