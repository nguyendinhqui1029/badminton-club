import type { accountType, genderType } from '@app/constants/common.constant';
export interface UserInfoSearch {
    id: string;
    name: string;
    avatar: string;
}

export interface FeelingValue {
    id: string;
    name: string;
    icon: string;
}
export interface FeelingGroupValue {
    id: string;
    groupName: string;
    children: FeelingValue[];
}

export interface UserInfoSearchResponse extends UserInfoSearch {
    friends: UserInfoSearch;
}

export interface UserResponse {
    id: string;
    point: number;
    email: string;
    phone: string;
    name: string;
    role: string[];
    avatar: string;
    birthday: Date;
    idFriends: UserInfoSearch[];
    status: 'ON' | 'OFF';
    createdAt: Date;
    updatedAt: Date;
}

export interface UserInfoWithIdFriendResponse {
    id: string;
    point: number;
    email: string;
    phone: string;
    name: string;
    role: string[];
    avatar: string;
    birthday: Date;
    idFriends: string[];
    status: 'ON' | 'OFF';
    createdAt: Date;
    updatedAt: Date;
    accountType: string;
    gender: string;
}

export interface UserLoginResponse {
    id: string;
    point: number;
    email: string;
    phone: string;
    name: string;
    role: string[];
    avatar: string;
    birthday: string;
    idFriends: string[];
    gender: string;
    accountType: string;
    status: string;
}

export interface UserRequestBody {
    id: string | null;
    email: string;
    phone: string;
    name: string;
    password:string;
    birthday: Date;
    status: 'ON' | 'OFF';
    gender: typeof genderType;
    accountType: typeof accountType;
}