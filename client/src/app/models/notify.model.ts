import { UserInfoSearch } from "./user.model";

export interface NotifyResponse {
    id: string;
    isViewed: boolean;
    content: string;
    shortContent: string;
    from: UserInfoSearch;
    createdAt: Date;
    read: string[];
    navigateToDetailUrl: string;
}
 export interface NotificationRequestParams {
    idUser: string;
    limit: number;
    page: number;
 }
 export interface NotificationResponseValue {
   id?: string;
   content: string;
   fromUser: UserInfoSearch | null,
   navigateToDetailUrl: string;
   isRead: boolean;
   createdAt: Date;
   read: string[];
 }
 export interface NotificationRequestBody {
    id?: string;
    read: string[];
    content: string;
    fromUser: string | null,
    navigateToDetailUrl: string;
    to: string[];
    status: string;
  }