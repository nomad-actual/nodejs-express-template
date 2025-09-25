import pino from "pino"

const logger = pino({
    redact: [
        'req.headers.authorization',
        'req.headers.Authorization',
    ]
})

export default logger
