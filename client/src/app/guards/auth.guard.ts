import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from '@app/services/user.service';
import { path } from '@app/constants/path.constant';

export const AuthGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.currentUserLogin.pipe(
    map(userInfo => {
      if (userInfo?.id) {
        return true;
      }
      if (typeof window !== 'undefined') { // Ensure navigation only on the client-side
        router.navigate([`/${path.LOGIN.ROOT}`]);
      }
      return false;
    })
  );
};