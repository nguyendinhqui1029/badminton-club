import { CURRENT_USER_INIT } from '@app/constants/common.constant';
import { UserLoginResponse } from '@app/models/user.model';
import {jwtDecode} from 'jwt-decode';

export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export function getUserInfoFromToken(token: string | null) {
  try {
    if(!token) {
      return CURRENT_USER_INIT;
    }
    return jwtDecode<UserLoginResponse>(token);
  } catch (error) {
    console.error('Invalid token', error);
    return CURRENT_USER_INIT;
  }
}