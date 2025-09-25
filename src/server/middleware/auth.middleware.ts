import jwt from "jsonwebtoken"

import logger from "../../utils/logger.ts"
import { loadConfig } from "../../utils/config.ts"
import { findSessionByUserId, findUserById } from "../db/database.ts"

// hydrate the request from auth to req.context
export default function isAllowed(req: any, res: any, next: Function) {
    const token = req.headers.authorization || ''
    if (!token) {
        return res.status(401).send('Unauthorized')
    }

    try {
        const { jwtAudience, jwtSecret } = loadConfig()

        const { payload } = jwt.verify(token, jwtSecret, {
            algorithms: ['HS384'],
            complete: true,
            audience: jwtAudience,
            ignoreExpiration: false,
        })

        const what = payload as jwt.JwtPayload

        req.context = {
            userId: what.userId,
            role: what.role,
            // todo: more?
        }

        next()
    } catch (e: any) {
        logger.warn({ error: e }, `Token verification issue (${e.message})`)
        res.status(401).send('Unauthorized')
    }
} 

