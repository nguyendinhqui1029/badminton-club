import { UserInfoSearch } from "./user.model";

export interface CommentItem {
  user: UserInfoSearch;
  id: string;
  content: string;
  status?: string;
  createdAt: string;
  children: CommentItem[];
}

export interface CommentRequestBody {
  content: string;
  status: string;
  idRootComment: string | null;
  idUser: string;
  images: string[];
  idPost: string;
}

export interface CommentResponseValue {
  id: string;
  content: string;
  status: string;
  idRootComment: {id: string} | null;
  createdAt: string;
  idUser: UserInfoSearch;
  images: string[];
  idPost: string;
}