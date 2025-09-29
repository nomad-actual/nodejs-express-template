import express from 'express';
import jwt from 'jsonwebtoken'

import { loadConfig } from '../utils/config.js';
import { validate } from '../server/middleware/validation.middleware.js';
import { type LoginPayloadRequest, LoginPayloadRequestSchema } from './types.js';
import { type SessionModel as RefreshTokenModel, type UserModel, type UserSession as UserPayload } from '../types/types.js';

const router = express.Router();
const c = loadConfig()

function createAndSaveSession(u: UserModel) {
    const jwtId = crypto.randomUUID();

    const session: RefreshTokenModel = {
        userId: u.userId,
        jwtId,
        createdAt: new Date(),
        lastUsed: null
    }

    const userPayload: UserPayload = {
        userId: u.userId,
        features: u.features,
        role: u.role.toString(),

    }

    // db.saveRefreshToken(u.userId, session)
    console.log(session)

    return {
        token: jwt.sign(userPayload, c.jwtSecret, {
            algorithm: 'HS384',
            expiresIn: '10s', // this is in seconds
            audience: c.jwtAudience
        }),
        refreshToken: jwt.sign(
            { id: jwtId, userId: u.userId },
            c.jwtRefreshSecret,
            {
                algorithm: 'HS384',
                expiresIn: '1m', // in reality this will be far longer like days
                audience: c.jwtAudience
            }
        )
    }
}

router.post('/login', validate({ body: LoginPayloadRequestSchema }), async (
    _req: express.Request<{}, {}, LoginPayloadRequest>,
    res
) => {
    // const { username = '', pass = '', deviceId = '' } = req.body

    const user = null
    if (!user) {
        return res.status(401).send('Unauthorized')
    }

    const response = createAndSaveSession(user)
    res.status(200).send(response)
})


router.post('/refresh', async (_req, res) => {
    // const session = db.findSessionByRefreshToken(req.body.refreshToken)
    const session = null
    if (!session) {
        return res.status(401).send('Unauthorized')
    }

    // const user = db.findUserById(session?.userId)
    const user = null
    if (!user) {
        return res.status(401).send('Unauthorized')
    }

    const response = createAndSaveSession(user)
    return res.status(200).send(response)
})

router.post('/logout', async (_req, _res) => {
    // use token/user/deviceid, look up, delete session(s)

})

export default router
