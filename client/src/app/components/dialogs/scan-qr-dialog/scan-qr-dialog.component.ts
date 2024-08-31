import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { PaymentService } from '@app/services/payment.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-scan-qr-dialog',
  standalone: true,
  imports: [],
  templateUrl: './scan-qr-dialog.component.html',
  styleUrl: './scan-qr-dialog.component.scss'
})
export class ScanQrDialogComponent implements OnInit{
  
  @Output() onCloseDialog = new EventEmitter();
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private paymentService:PaymentService = inject(PaymentService);
  
  paymentQrCodeBase64: string = '';

  ngOnInit(): void {
    this.paymentService.getPaymentQrCode('1223').subscribe((response)=>{
      if(response.statusCode !== 200) {
        return;
      }
      this.paymentQrCodeBase64 = response.data;
    })
  }

  onClickCloseDialog() {
    this.dynamicDialogRef.close();
  }
}
