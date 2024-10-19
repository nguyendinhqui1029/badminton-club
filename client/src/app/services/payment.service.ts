import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { ApiResponseValue } from '@app/models/api-response.model';
import { PaymentRequestBody, PaymentResponseValue } from '@app/models/payment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http: HttpClient = inject(HttpClient);
  getPaymentQrCode(id: string): Observable<ApiResponseValue<string>> {
    return this.http.get<ApiResponseValue<string>>(`${environment.apiUrl}/api/v1/qr-code/${id}`);
  }

  createMultipleTransaction(body: PaymentRequestBody): Observable<ApiResponseValue<PaymentResponseValue>> {
    return this.http.post<ApiResponseValue<PaymentResponseValue>>(`${environment.apiUrl}/api/v1/transaction/multiple`,body);
  }

  getAllPayment(keyword: string, status: string): Observable<ApiResponseValue<PaymentResponseValue[]>> {
    const params = new HttpParams().set('keyword', keyword).set('status',status);
    return this.http.get<ApiResponseValue<PaymentResponseValue[]>>(`${environment.apiUrl}/api/v1/transaction`, {params});
  }

  getSumAmountByMonth(payload: {startMonth: number; endMonth: number; year: number}): Observable<ApiResponseValue<Record<string,{recharge: number; withdraw: number}>>> {
    const params = new HttpParams()
    .set('startMonth', payload.startMonth)
    .set('endMonth', payload.endMonth)
    .set('year', payload.year);
    return this.http.get<ApiResponseValue<Record<string,{recharge: number; withdraw: number}>>>(`${environment.apiUrl}/api/v1/transaction/sum-amount/months`, {params});
  }
}