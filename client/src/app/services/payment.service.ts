import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { ApiResponseValue } from '@app/models/api-response.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private http: HttpClient = inject(HttpClient);
   getPaymentQrCode(id: string): Observable<ApiResponseValue<string>> {
        return this.http.get<ApiResponseValue<string>>(`${environment.apiUrl}/qr-code/${id}`);
    }
}