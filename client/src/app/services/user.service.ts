import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CURRENT_USER_INIT } from '@app/constants/common.constant';
import { environment } from '@app/environments/environment';
import { ApiResponseValue } from '@app/models/api-response.model';
import { UserInfoSearchResponse, UserInfoWithIdFriendResponse, UserLoginResponse, UserRequestBody, UserResponse } from '@app/models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http: HttpClient = inject(HttpClient);
  private currentUserLoginSubject = new BehaviorSubject<UserLoginResponse>(CURRENT_USER_INIT);

  get currentUserLogin():BehaviorSubject<UserLoginResponse> {
    return this.currentUserLoginSubject;
  }

  updateData(value: UserLoginResponse) {
    this.currentUserLoginSubject.next(value);
  }

  searchUserByKeyword(id: string, keyword: string): Observable<ApiResponseValue<UserInfoSearchResponse[]>> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<ApiResponseValue<UserInfoSearchResponse[]>>(`${environment.apiUrl}/api/v1/user/search/${id}`, { params });
  }

  login(body: { phone: string, password: string, isRememberMe: boolean }): Observable<ApiResponseValue<{ accessToken: string, refreshToken: string }>> {
    return this.http.post<ApiResponseValue<{ accessToken: string; refreshToken: string }>>(`${environment.apiUrl}/api/v1/user/login`, body);
  }

  logout() {
    return this.http.post<ApiResponseValue<{ message: string; }>>(`${environment.apiUrl}/api/v1/user/logout`, {});
  }

  resetPassword(body: {code: string; email: string; password: string}) {
    return this.http.post<ApiResponseValue<{id: string; phone: string}>>(`${environment.apiUrl}/api/v1/user/reset-password`, body);
  }

  refreshToken(body: {refreshToken: string}) {
    return this.http.post<ApiResponseValue<{accessToken: string}>>(`${environment.apiUrl}/api/v1/user/refresh-token`, body);
  }

  create(body: UserRequestBody): Observable<ApiResponseValue<UserLoginResponse>> {
    return this.http.post<ApiResponseValue<UserLoginResponse>>(`${environment.apiUrl}/api/v1/user`, body);
  }

  addFriend(body: {id: string, idFriends: string[]}): Observable<ApiResponseValue<UserLoginResponse>> {
    return this.http.put<ApiResponseValue<UserLoginResponse>>(`${environment.apiUrl}/api/v1/user/friend/add`, body);
  }

  getUserById(id: string) {
    return this.http.get<ApiResponseValue<UserInfoWithIdFriendResponse>>(`${environment.apiUrl}/api/v1/user/${id}`);
  }

  getAllUser() {
    return this.http.get<ApiResponseValue<UserInfoWithIdFriendResponse[]>>(`${environment.apiUrl}/api/v1/user`);
  }
}