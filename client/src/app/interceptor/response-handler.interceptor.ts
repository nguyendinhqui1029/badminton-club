import { HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const responseHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event: HttpEvent<any>) => {
      // Nếu cần thực hiện điều gì đó với phản hồi, làm ở đây
      if (event instanceof HttpResponse) {
        if(event.status === 200 && event.body.statusCode === 200) {
          const data = JSON.stringify(event.body.data).replace(/\"_id\":/gm,'\"id\":');
          event.body.data = JSON.parse(data);
        }
      }
      return event;
    }),
    catchError((error: HttpErrorResponse) => {
      // Kiểm tra lỗi và xử lý theo yêu cầu
      // if (error.status === 401) { // Ví dụ: xử lý khi token hết hạn
      //   return this.authService.refreshToken().pipe(
      //     switchMap(() => {
      //       // Tạo yêu cầu mới với token mới
      //       const newToken = this.authService.getToken();
      //       const clonedReq = req.clone({
      //         setHeaders: {
      //           Authorization: `Bearer ${newToken}`
      //         }
      //       });
      //       return next(clonedReq);
      //     }),
      //     catchError((err) => {
      //       // Xử lý lỗi khi làm mới token không thành công
      //       return throwError(() => new Error(err));
      //     })
      //   );
      // }
      // Xử lý lỗi khác (nếu cần)
      return throwError(() => new Error(error.message));
    })
  );;
};
