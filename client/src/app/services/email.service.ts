import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { ApiResponseValue } from '@app/models/api-response.model';
import { EmailRequestBody, EmailResponseValue } from '@app/models/email.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EmailService {
    private http: HttpClient = inject(HttpClient);
    sendEmailResetPassword(body: EmailRequestBody): Observable<ApiResponseValue<EmailResponseValue>> {
        console.log('body', body)
        return this.http.post<ApiResponseValue<EmailResponseValue>>(`${environment.apiUrl}/email/reset-password`, body);
    }
}