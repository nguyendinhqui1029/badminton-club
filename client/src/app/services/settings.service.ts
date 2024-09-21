import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { ApiResponseValue } from '@app/models/api-response.model';
import { SettingsRequestBody, SettingsResponseValue } from '@app/models/setting.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private http: HttpClient = inject(HttpClient);
    createSetting(body: Partial<SettingsRequestBody>): Observable<ApiResponseValue<SettingsResponseValue>> {
        return this.http.post<ApiResponseValue<SettingsResponseValue>>(`${environment.apiUrl}/api/v1/settings`, body);
    }

    updateSetting(id:string,body:Partial<SettingsRequestBody>): Observable<ApiResponseValue<SettingsResponseValue>> {
        return this.http.put<ApiResponseValue<SettingsResponseValue>>(`${environment.apiUrl}/api/v1/settings/${id}`, body);
    }

    getSetting(): Observable<ApiResponseValue<SettingsResponseValue>> {
        return this.http.get<ApiResponseValue<SettingsResponseValue>>(`${environment.apiUrl}/api/v1/settings`);
    }
}