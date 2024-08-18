export interface UserInfoSearch {
    id: string;
    name: string;
    avatar: string;
}

export interface UserInfoSearchResponse extends UserInfoSearch {
    friends: UserInfoSearch;
}

export interface UserResponse {
    point: number;
    email: string;
    phone: string;
    name: string;
    role: string[];
    avatar: string;
    birthday: Date;
    idFriends: UserInfoSearch[];
    status: 'BLOCK' | 'WAITING' | 'ON' | 'OFF';
    createdAt: Date;
    updatedAt: Date;
}