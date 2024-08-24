import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { ApiResponseValue } from '@app/models/api-response.model';
import { UserInfoSearchResponse, UserLoginResponse } from '@app/models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http: HttpClient = inject(HttpClient);
  private currentUserLoginSubject = new BehaviorSubject<UserLoginResponse>({
    id: '',
    point: 0,
    email: '',
    phone: '',
    name: '',
    role: [],
    avatar: '',
    birthday: ''
  });

  get currentUserLogin() {
    return this.currentUserLoginSubject.asObservable();
  }

  updateData(value: UserLoginResponse) {
    this.currentUserLoginSubject.next(value);
  }

  searchUserByKeyword(id: string, keyword: string): Observable<ApiResponseValue<UserInfoSearchResponse[]>> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<ApiResponseValue<UserInfoSearchResponse[]>>(`${environment.apiUrl}/user/search/${id}`, { params });
  }

  login(body: { phone: string, password: string, isRememberMe: boolean }): Observable<ApiResponseValue<{ accessToken: string, refreshToken: string }>> {
    return this.http.post<ApiResponseValue<{ accessToken: string; refreshToken: string }>>(`${environment.apiUrl}/user/login`, body);
  }

  logout() {
    return this.http.post<ApiResponseValue<{ message: string; }>>(`${environment.apiUrl}/user/logout`, {});
  }
}