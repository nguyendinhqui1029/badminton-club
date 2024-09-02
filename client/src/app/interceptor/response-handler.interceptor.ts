import { HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { localStorageKey } from '@app/constants/common.constant';
import { UserService } from '@app/services/user.service';
import { throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export const responseHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event: HttpEvent<any>) => {
      // Nếu cần thực hiện điều gì đó với phản hồi, làm ở đây
      if (event instanceof HttpResponse) {
        if(event.status === 200 && event.body.statusCode === 200 && event.body.data) {
          const data = JSON.stringify(event.body.data).replace(/\"_id\":/gm,'\"id\":');
          event.body.data = JSON.parse(data);
        }
      }
      return event;
    }),
    catchError((error: HttpErrorResponse) => {
      // Kiểm tra lỗi và xử lý theo yêu cầu
      if (error.status === 401) { // Ví dụ: xử lý khi token hết hạn
        const refreshToken = localStorage.getItem(localStorageKey.REFRESH_TOKEN);
        if(!refreshToken) {
        return throwError(() => new Error('Token invalid'));
        }
        const userService: UserService = inject(UserService);
        return userService.refreshToken({refreshToken}).pipe(
          switchMap((response) => {
            // Tạo yêu cầu mới với token mới
            const clonedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.data.accessToken}`
              }
            });
            return next(clonedReq);
          }),
          catchError((err) => {
            // Xử lý lỗi khi làm mới token không thành công
            return throwError(() => new Error(err));
          })
        );
      }
      // Xử lý lỗi khác (nếu cần)
      return throwError(() => new Error(error.message));
    })
  );;
};
