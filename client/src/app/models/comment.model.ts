import { UserInfoSearch } from "./user.model";

export interface CommentItem {
  user: UserInfoSearch;
  id: string;
  content: string;
  status?: string;
  createdAt: string;
  children: CommentItem[];
}