import { UserInfoSearch } from "./user.model";

export interface PostRequestBody {
    id?: string;
    images: string[];
    background: string;
    content: string;
    hashTag: string[];
    tagFriends: string[];
    tagLocation: string;
    feelingIcon: string;
    createdBy: string;
    idUserLike?: string[];
    countComment?: number;
    shareLink?: string[];
    scope: 'Everyone' | 'Only_Me' | 'Friends';
}
export interface PostResponseValue {
    id?: string;
    images: string[];
    background: string;
    content: string;
    idUserLike: UserInfoSearch[];
    countComment: number;
    shareLink: UserInfoSearch[];
    hashTag: string[];
    createdAt: string;
    updatedAt: string;
    createdBy: UserInfoSearch;
    tagFriends: UserInfoSearch[];
    tagLocation: string;
    feelingIcon: string;
    scope: 'Everyone' | 'Only_Me' | 'Friends';
}