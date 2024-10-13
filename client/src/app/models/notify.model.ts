import { UserInfoSearch } from "./user.model";

export interface NotifyResponse {
    id: string;
    isViewed: boolean;
    content: string;
    title: string;
    from: UserInfoSearch;
    createdAt: Date;
    read: string[];
    navigateToDetailUrl: string;
    type: string;
    status: string;
}
 export interface NotificationRequestParams {
    idUser: string;
    limit: number;
    page: number;
    type?: string;
 }
 export interface NotificationResponseValue {
   id?: string;
   title: string;
   content: string;
   fromUser: UserInfoSearch | null,
   navigateToDetailUrl: string;
   isRead: boolean;
   createdAt: Date;
   read: string[];
   type: string;
   status: string;
   to: string[];
 }
export interface NotificationRequestBody {
    id?: string;
    read: string[];
    title: string;
    content: string;
    fromUser: string | null,
    navigateToDetailUrl: string;
    to: string[];
    status?: string;
    type: string;
}

export interface NotificationSocketParams {
  to: string[];
  type: string;
  notifyInfo: NotificationResponseValue | null;
}

export interface NotificationSocketResponseValue {
  total: number;
  notifyContent: NotificationResponseValue;
}