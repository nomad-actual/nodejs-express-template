import express from 'express';
import { Server } from 'http';


import { type HttpServerConfig } from '../utils/config.js';
import logger from '../utils/logger.js';
import httpLogger from '../utils/httpLogger.js';
import AuthMiddleWare from './middleware/auth.middleware.js'

import UserRouter from '../routes/user.routes.js'
import AuthRouter from '../routes/auth.routes.js'

let appServer: Server;

const app = express();
app.use(express.json())
app.use(httpLogger)

// route registrations
app.use('/v1/auth', AuthRouter)
app.use('/v1/users', AuthMiddleWare, UserRouter)


export async function startAppServer(config: HttpServerConfig) {
    return new Promise<void>((res, rej) => {

        appServer = app.listen(config.port, config.host, (err?: Error) => {
            if (err) {
                logger.error({ error: err }, 'Error Starting Application HTTP Server')
                rej(err)
                return
            }

            logger.info('Application HTTP Server Started!')
            res()
        })
    })
}

export async function stopAppServer() {
    if (!appServer) {
        logger.warn('No Application HTTP Server to shutdown')
        return
    }
    
    return new Promise<void>((res, rej) => {
        appServer.close((err?: Error) => {
            if (err) {
                logger.error({ error: err }, 'Error shutting down Application HTTP Server')
                return rej(err)
            }

            logger.info('Application HTTP Server Shutdown success')
            res()
        })
    })
}
