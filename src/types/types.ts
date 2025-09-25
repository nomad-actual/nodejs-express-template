export type UserModel = {
    userId: string,
    userName: string,
    deviceId: string,
    pass: string,
    role: 'admin' | 'user',
    features: string[],
}

export type SessionModel = {
    userId: string,
    jwtId: string,
    createdAt: Date,
    lastUsed: Date | null,
}

export type UserSession = {
    userId: string,
    features: string[],
    role: string,
}
