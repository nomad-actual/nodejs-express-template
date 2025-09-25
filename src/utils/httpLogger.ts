import PinoHttp from "pino-http"
import { randomUUID } from "node:crypto"

import logger from "./logger.ts"

const httpLogger = PinoHttp({
    logger: logger,
    genReqId: (req, res) => {
        const existingID = req.id ?? req.headers["x-request-id"]
        
        if (existingID) return existingID

        const id = randomUUID()
        res.setHeader('X-Request-Id', id)

        return id
  },
})

export default httpLogger
