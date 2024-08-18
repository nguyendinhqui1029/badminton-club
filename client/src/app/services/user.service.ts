import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { ApiResponseValue } from '@app/models/api-response.model';
import { UserInfoSearchResponse } from '@app/models/user.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http: HttpClient = inject(HttpClient);
    searchUserByKeyword(id: string, keyword: string): Observable<ApiResponseValue<UserInfoSearchResponse[]>> {
        const params = new HttpParams().set('keyword', keyword);
        return this.http.get<ApiResponseValue<UserInfoSearchResponse[]>>(`${environment.apiUrl}/user/search/${id}`, {params});
    }
}