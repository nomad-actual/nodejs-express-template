export type HttpServerConfig = {
    host: string,
    port: number,
    // todo - things like max timeouts and such

}


export type SuperConfig = {
    appServer: HttpServerConfig,
    healthServer: HttpServerConfig,

    jwtSecret: string,
    jwtRefreshSecret: string,
    jwtAudience: string,

    system: {
        shutdownGracePeriod: number
    }
}

function toNum(s: string | undefined) {
    return s ? +s : 0
}


export function loadConfig(): SuperConfig {
    return Object.freeze({
        appServer: {
            host: process.env.APP_SERVER_HOST || 'localhost',
            port: toNum(process.env.APP_SERVER_PORT) || 3000
        },
        healthServer: {
            host: process.env.HEALTH_SERVER_HOST || 'localhost',
            port: toNum(process.env.HEALTH_SERVER_PORT) || 3001
        },
        system: {
            shutdownGracePeriod: toNum(process.env.GRACEFUL_SHUTDOWN_MS) || 1000
        },
        jwtSecret: process.env.JWT_SECRET || '',
        jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '',
        jwtAudience: process.env.JWT_AUDIENCE || '',
    })
}
