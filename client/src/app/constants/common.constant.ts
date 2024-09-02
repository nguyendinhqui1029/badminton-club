import { PostResponseValue } from "@app/models/post.model"

export const scopePost = {
    EVERYONE: 'Everyone',
    ONLY_ME: 'Only_Me',
    FRIENDS: 'Friends'
}

export const imageOrientation  = {
    LANDSCAPE: 'landscape',
    PORTRAIT: 'portrait',
    SQUARE: 'square'
}

export const accountType  = {
    CASUAL_PLAYER: 'Casual_Player',
    FIXED_PLAYER: 'Fixed_Player'
}

export const genderType  = {
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

export const CURRENT_USER_INIT = {
    id: '',
    point: 0,
    email: '',
    phone: '',
    name: '',
    role: [],
    avatar: '',
    birthday: '',
    idFriends: []
};

export const INIT_POST_VALUE = {
    images: [],
    background: 'bg-gray-color-20==/==placeholder:text-black-100 text-black',
    content: '',
    idUserLike: [],
    idComment: [],
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
    WAITING: 'waiting',
    DONE: 'done',
    LATE: 'late'
}

export const defaultAvatar = 'assets/images/default_avatar.webp';

export const userRole = {
    USER: 'user',
    ADMIN: 'admin',
    SUPPER_ADMIN: 'supperAdmin'
}