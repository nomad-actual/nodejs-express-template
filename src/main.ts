import { startAppServer, stopAppServer } from "./server/app.server.ts"
import { startHealthServer, stopHealthServer } from "./server/health.server.ts"
import { loadConfig } from "./utils/config.ts"
import logger from "./utils/logger.ts"
import { init as initDb } from './server/db/database.ts'
import { sleep } from "./utils/system.utils.ts"

const config = loadConfig()

async function start() {
    logger.info('Service starting up!')

    // init toggles
    // init dbs
    await initDb()

    // init vendor stuff

    await startHealthServer(config.healthServer)
    await startAppServer(config.appServer)

    // todo swagger/open api server whe not running in prod
}

async function shutdown() {
    logger.warn('Shutdown signal recieved! Waiting for grace period...')

    await sleep(config.system.shutdownGracePeriod)

    logger.info('Shutdown commencing')

    try {
        await stopAppServer()
        await stopHealthServer()
    } catch (error) {
        logger.error({ error }, 'Error stopping servers')
    } finally {
        process.exit(0)
    }
}

process.on('SIGINT', () => shutdown())
process.on('SIGTERM', () => shutdown())


start().catch((e) => {
    logger.error({ error: e }, 'Error initializing Service')
})

