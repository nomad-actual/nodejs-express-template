import { type UserModel, type SessionModel } from '../../types/types.ts'
import logger from '../../utils/logger.ts'
import { generatePasswordHash } from '../../utils/system.utils.ts'



const lolDb: { users: UserModel[], sessions: { [key: string]: SessionModel }} = {
    users: [],
    sessions: {}
}

export async function init() {
    lolDb.users = [{
        userId: '1',
        userName: 'CoolAdmin',
        deviceId: 'someDevice1',
        pass: await generatePasswordHash('booty'),
        role: 'admin',
        features: ['all']
    }]
}

export function getDb() {
    return lolDb
}

export function saveRefreshToken(userId: string, session: SessionModel) {
    lolDb.sessions[userId] = session
}

export async function findUser(username: string, pass: string, deviceId: string) {
    const hashedPass = await generatePasswordHash(pass)

    const user = lolDb.users.find((u: UserModel) => u.userName === username
        && u.pass === hashedPass
        && u.deviceId === deviceId
    )

    return user || null
}

export function findUserById(userId: string, role?: string) {
    if (!userId) return null
    const user = lolDb.users.find((u: UserModel) => u.userId === userId)

    if (!user) {
        return null
    }

    if (role && role !== user.role) {
        logger.warn(
            { userId, requestRole: role, dbRole: user.role }, 
            'User role does not matching records. Removing session.'
        )

        delete lolDb.sessions[userId]
        return null
    }

    return user || null
}


export function findSessionByUserId(userId: string) {
    if (!userId) return null

    const session = lolDb.sessions[userId]

    return session || null
}


export function findSessionByRefreshToken(refreshToken: string) {
    if (!refreshToken) {
        return null
    }

    const session = Object.values(lolDb.sessions)
        .find((s: any) => s.refreshToken === refreshToken)

    return session || null
}
