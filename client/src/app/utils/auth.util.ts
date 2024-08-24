import { UserLoginResponse } from '@app/models/user.model';
import {jwtDecode} from 'jwt-decode';

export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export function getUserInfoFromToken(token: string) {
  try {
    const decoded: UserLoginResponse = jwtDecode<UserLoginResponse>(token);
    return decoded; // This contains the payload of the token
  } catch (error) {
    console.error('Invalid token', error);
    return {
      id: '',
      point: 0,
      email: '',
      phone: '',
      name: '',
      role: [],
      avatar: '',
      birthday: ''
    };
  }
}