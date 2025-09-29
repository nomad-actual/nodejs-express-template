import PinoHttp from 'pino-http'
import { randomUUID } from 'node:crypto'
import logger from './logger.js'

const httpLogger = PinoHttp.pinoHttp({
    logger: logger,
    genReqId: (req: any, res: any) => {
        const existingID = req.id ?? req.headers['x-request-id']
        
        if (existingID) return existingID

        const id = randomUUID()
        res.setHeader('x-request-id', id)

        return id
  },
})

export default httpLogger
