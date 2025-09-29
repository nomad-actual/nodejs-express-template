import { DataSource } from "typeorm"
import { loadConfig, isLocal } from "../../../utils/config.js"
import logger from "../../../utils/logger.js"
import { PinoTypeOrmLogger } from "../db.logger.js"
import { User } from "./entities/User.entity.js"

let legacyDbDataSource: DataSource

export function getLegacyDb() {
    if (!legacyDbDataSource) {
        const { legacy } = loadConfig().databases

        legacyDbDataSource = new DataSource({
            ...legacy,
            type: isLocal() ? 'sqlite' : 'mysql',
            synchronize: false,
            logging: true,
            logger: new PinoTypeOrmLogger(logger),
            entities: [User],
            subscribers: [],
            migrations: [],
        })
    }

    return legacyDbDataSource
}
