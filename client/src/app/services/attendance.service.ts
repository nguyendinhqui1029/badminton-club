import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { ApiResponseValue } from '@app/models/api-response.model';
import { AttendanceResponseValue } from '@app/models/attendance.model';
import { PostRequestBody, PostResponseValue } from '@app/models/post.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private http: HttpClient = inject(HttpClient);

  getAttendanceByIdUser(id: string, fromDate: string, toDate: string): Observable<ApiResponseValue<AttendanceResponseValue[]>> {
    const params = new HttpParams().set('idUser', id).set('fromDate',fromDate).set('toDate',toDate);
    return this.http.get<ApiResponseValue<AttendanceResponseValue[]>>(`${environment.apiUrl}/api/v1/attendance/by-user`, { params });
  }

  getAllAttendanceByDate(createdDate: string): Observable<ApiResponseValue<AttendanceResponseValue[]>> {
    const params = new HttpParams().set('createdDate', createdDate);
    return this.http.get<ApiResponseValue<AttendanceResponseValue[]>>(`${environment.apiUrl}/api/v1/attendance/by-created-date`, { params });
  }
}