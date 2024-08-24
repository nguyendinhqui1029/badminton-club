import { Component } from '@angular/core';
import { IMAGE_BASE64_EXAMPLE } from '@app/constants/qr-base64.constant';
import jsQR from 'jsqr';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [],
  templateUrl: './qr-scanner.component.html',
  styleUrl: './qr-scanner.component.scss'
})
export class QrScannerComponent {
  result: string | null = null;
  IMAGE_BASE64_EXAMPLE = IMAGE_BASE64_EXAMPLE;
  constructor() { }

  scanQRCodeFromImage(source: string): void {
    if (source) {
      const imageElement = new Image();
      imageElement.src = source;

      imageElement.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          canvas.width = imageElement.width;
          canvas.height = imageElement.height;
          context.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const decoded = jsQR(imageData.data, canvas.width, canvas.height);

          if (decoded) {
            this.result = decoded.data;
            console.log('QR Code Detected:', decoded.data);
          } else {
            this.result = 'No QR code found';
          }
        }
      };
    }
  }
}
