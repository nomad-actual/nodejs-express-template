import logger from '../../utils/logger.js'
import type { Request } from 'express'

// todo export
const roles: { [key: string]: number } = {
    user: 10,
    admin: 20,
    'super-admin': 50,
}


function isRoleMinOrBetter(requestRole: string, minRoleRequired: string) {
    const dbRoleScore = roles[requestRole] || 0
    const minRoleScore = roles[minRoleRequired] || 0
    
    if (dbRoleScore === 0 || minRoleScore === 0) {
        return false
    }

    return dbRoleScore >= minRoleScore
}


export function checkPermissions(requiredMinRole: string) {
    return (req: Request, res: any, next: Function) => {
        try {
            const { role  = '' } = req.context || {}

            if (isRoleMinOrBetter(role, requiredMinRole) === false) {
                res.status(403).send('Not authorized')
                return
            } 

            // should we do RBAC here though....
            // check permissions (must have at least 1)

            next()
        } catch (e: any) {
            logger.warn({ error: e }, `Token verification issue (${e.message})`)
            res.status(403).send('Not authorized')
        }
    }
}


