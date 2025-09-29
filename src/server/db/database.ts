import logger from '../../utils/logger.js'
import { User } from './legacy/entities/User.entity.js'
import { getLegacyDb } from './legacy/legacy.db.js'


export async function startDbs() {
    return getLegacyDb().initialize()
}

export async function stopDbs() {
    if (!getLegacyDb().isInitialized) {
        logger.info('Legacy database not init-ed')
        return
    }

    return getLegacyDb().destroy()
}

export async function testWrite() {
    const userRepo = getLegacyDb().getRepository(User)

    const user = new User()
    user.firstName = 'John'
    user.lastName = 'Doe'
    user.isActive = true
    await userRepo.save(user)

    return userRepo.count()
    
}
