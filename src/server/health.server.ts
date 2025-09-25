import express from 'express';
import { Server } from 'http';
import type { HttpServerConfig } from '../utils/config.ts';
import logger from '../utils/logger.ts';


const healthApp = express();
let healthInstance: Server;

healthApp.get('/health', async(req, res) => {
    res.status(200).send('OK')
})


export async function startHealthServer(config: HttpServerConfig) {
    return new Promise<void>((res, rej) => {

        healthInstance = healthApp.listen(config.port, config.host, (err?: Error) => {
            if (err) {
                logger.error({ error: err }, 'Error Starting Health HTTP Server')
                rej(err)
                return
            }

            logger.info('Health HTTP Server Started!')
            res()
        })
    })
}

export async function stopHealthServer() {
    if (!healthInstance) {
        logger.warn('No Health HTTP Server to shutdown')
        return
    }

    return new Promise<void>((res, rej) => {
        healthInstance.close((err?: Error) => {
            if (err) {
                logger.error({ error: err }, 'Error shutting down Health HTTP Server')
                return rej(err)
            }

            logger.info('Health HTTP Server Shutdown success')
            res()
        })
    })
}
