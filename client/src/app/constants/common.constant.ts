import { PostResponseValue } from "@app/models/post.model"
import { UserLoginResponse } from "@app/models/user.model"

export const scopePost = {
    EVERYONE: 'Everyone',
    ONLY_ME: 'Only_Me',
    FRIENDS: 'Friends'
}

export const imageOrientation = {
    LANDSCAPE: 'landscape',
    PORTRAIT: 'portrait',
    SQUARE: 'square'
}

export const accountType = {
    CASUAL_PLAYER: 'Casual_Player',
    FIXED_PLAYER: 'Fixed_Player'
}

export const paymentType = {
    RECHARGE: 'RECHARGE',
    WITHDRAW: 'WITHDRAW'
}

export const activeAccountType = {
    OFF: 'OFF',
    ON: 'ON'
}


export const genderType = {
    MALE: 'Male',
    FEMALE: 'Female'
}

export const localStorageKey = {
    IS_REMEMBER_ME: 'Is_Remember_Me',
    PHONE: 'Phone',
    PASSWORD: 'P1',
    ACCESS_TOKEN: 'Access_Token',
    REFRESH_TOKEN: 'Refresh_Token',
}

export const emailType = {
    RESET_PASSWORD: 'Reset_Password'
}

export const socialType = {
    FACEBOOK: 'Facebook',
    ZALO: 'Zalo',
    TWITTER: 'Twitter',
    LINKEDIN: 'Linkedin'
}

export const CURRENT_USER_INIT: UserLoginResponse = {
    id: '',
    point: 0,
    email: '',
    phone: '',
    name: '',
    role: [],
    avatar: '',
    birthday: '',
    idFriends: [],
    accountType: accountType.FIXED_PLAYER,
    gender: genderType.MALE,
    status: '',
};

export const INIT_POST_VALUE = {
    images: [],
    background: 'bg-gray-color-20==/==placeholder:text-black-100 text-black',
    content: '',
    idUserLike: [],
    countComment: 0,
    shareLink: [],
    hashTag: [],
    createdAt: '',
    updatedAt: '',
    createdBy: {
        id: '',
        name: '',
        avatar: '',
    },
    tagFriends: [],
    tagLocation: '',
    feelingIcon: '',
    scope: scopePost.EVERYONE
} as PostResponseValue;

export const paymentStatus = {
    WAITING: 'PENDING',
    DONE: 'DONE',
    LATE: 'LATE'
}

export const defaultAvatar = 'assets/images/default_avatar.webp';

export const userRole = {
    USER: 'user',
    ADMIN: 'admin',
    SUPPER_ADMIN: 'supperAdmin'
}

export const attendanceStatus = {
    LATE: 'LATE',
    ON_TIME: 'ON_TIME',
    OFF: 'OFF',
    DONE: 'DONE',
    WAITING: 'WAITING',
    EARLY: 'EARLY'
}

export const dayOfWeek = ['CN','T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export const notificationType = {
    POST: 'POST',
    ADD_FRIEND: 'ADD_FRIEND',
    UN_FRIEND: 'UN_FRIEND',
    COMMENT: 'COMMENT',
    LIKE: 'LIKE',
    PLAY_BADMINTON: 'PLAY_BADMINTON',
    REMIND: 'REMIND',
    EVENT: 'EVENT',
    RELOAD_DATA: 'RELOAD_DATA'
}


export const notificationStatus = {
    DONE: 'DONE' ,
    IN_PROCESS: 'IN_PROCESS' ,
    DENIED: 'DENIED'
}