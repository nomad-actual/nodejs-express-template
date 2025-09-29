import type { Logger } from "typeorm";
import pino from "pino";

export class PinoTypeOrmLogger implements Logger {
    private readonly _pinoLogger: pino.Logger
    
    constructor(pinoLogger: pino.Logger) {
        this._pinoLogger = pinoLogger
    }

    logQuery(query: string, parameters?: any[]) {
        this._pinoLogger.debug({ parameters }, `Query: ${query}`)
    }

    logQueryError(error: string | Error, query: string, parameters?: any[]) {
        // parameters not allowed?
        this._pinoLogger.error({ error, parameters }, `Query failed: ${query}`)
    }

    logQuerySlow(time: number, query: string, parameters?: any[]) {
        this._pinoLogger.warn({ time, parameters }, `Query took ${time} ms: ${query}`)
    }

    logSchemaBuild(message: string) {
        this._pinoLogger.debug(`Query schema built: ${message}`)
    }

    logMigration(message: string) {
        this._pinoLogger.info(`Migration ${message}`)
    }

    log(level: "log" | "info" | "warn", message: any) {
        switch(level) {
            case 'log':
                this._pinoLogger.debug(message)
                break;
            case 'warn':
                this._pinoLogger.warn(message)
                break;
            case 'info':
            default:
                this._pinoLogger.info(message)
                break;
        }
    }
    
}
