import { UserInfoSearch } from "./user.model";

export interface NotifyResponse {
    id: string;
    isViewed: boolean;
    content: string;
    shortContent: string;
    from: UserInfoSearch;
    to: UserInfoSearch[];
    createdAt: Date;
}

