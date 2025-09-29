import { startAppServer, stopAppServer } from './server/app.server.js'
import { startHealthServer, stopHealthServer } from './server/health.server.js'
import { loadConfig } from './utils/config.js'
import logger from './utils/logger.js'
import { startDbs, stopDbs, testWrite } from './server/db/database.js'
import { sleep } from './utils/system.utils.js'

// needs import somewhere global
import 'reflect-metadata'

const config = loadConfig()

async function start() {
    logger.info('Service starting up!')

    // init toggles

    try {
        await startDbs()

        // init vendor stuff (like aws, etc)

        await startHealthServer(config.healthServer)
        await startAppServer(config.appServer)


        const count = await testWrite()
        logger.info(`Test write to db successful: ${count}`)

        // todo swagger/open api server whe not running in prod
    } catch (e) {
        logger.error({ error: e }, 'Failed to start service')
    }
    
}

async function shutdown() {
    logger.warn('Shutdown signal recieved! Waiting for grace period...')

    await sleep(config.system.shutdownGracePeriod)

    logger.warn('Shutdown commencing')

    // safely shutdown regardless of outcome
    const promises = await Promise.allSettled([
        stopAppServer(),
        stopHealthServer(),
        stopDbs(),
    ])

    promises.forEach((p => {
        if (p.status === 'rejected') {
            logger.error(`Shutdown promise rejection ${p.reason}`)
        }
    }))

    process.exit(0)
}

process.on('SIGINT', () => shutdown())
process.on('SIGTERM', () => shutdown())
process.on('uncaughtException', (error: Error) => logger.error({ error }, 'Uncaught error'))

start().catch((e) => {
    logger.error({ error: e }, 'Error initializing Service')
})

