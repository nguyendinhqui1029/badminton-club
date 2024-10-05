export const ROUTER_PATH = {
    ROOT: '/api',
    VERSION: 'v1',
    USER: 'user',
    FILE_UPLOAD: 'files-upload',
    ATTENDANCE: 'attendance',
    SELF_CLAIM: 'self-claim',
    COMMENT: 'comment',
    POST: 'post',
    EVENT: 'event',
    TRANSACTION: 'transaction',
    SETTINGS: 'settings',
    FILES: 'files',
    EMAIL: 'email',
    LOCATION: 'location',
    QR_CODE: 'qr-code',
    PUSH_NOTIFICATION: 'push-notification',
    NOTIFICATION: 'notification',
    COMMON: 'common'
}

export const accountType  = {
    CASUAL_PLAYER: 'Casual_Player',
    FIXED_PLAYER: 'Fixed_Player'
}

export const userStatus = {
    ON: 'ON',
    OFF: 'OFF'
}

export const notificationType = {
    POST: 'POST',
    ADD_FRIEND: 'ADD_FRIEND'
}

export const scopePost = {
    EVERYONE: 'Everyone',
    ONLY_ME: 'Only_Me',
    FRIENDS: 'Friends'
}

export const notificationStatus = {
    DONE: 'DONE' ,
     IN_PROCESS:'IN_PROCESS' ,
     DENIED:'DENIED'
} as const;