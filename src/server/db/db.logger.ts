import { Logger, QueryRunner } from "typeorm";
import pino from "pino";

export class PinoTypeOrmLogger implements Logger {
    private readonly _pinoLogger: pino.Logger
    
    constructor(pinoLogger: pino.Logger) {
        this._pinoLogger = pinoLogger
    }
    
    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this._pinoLogger.debug({ parameters }, `Query: ${query}`)
    }

    logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        // parameters not allowed?
        this._pinoLogger.error({ error }, `Query failed: ${query}`)
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this._pinoLogger.warn({ time }, `Query took ${time} ms: ${query}`)
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner) {
        this._pinoLogger.debug(`Query schema built: ${message}`)
    }

    logMigration(message: string, queryRunner?: QueryRunner) {
        this._pinoLogger.info(`Migration ${message}`)
    }

    log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner) {
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
