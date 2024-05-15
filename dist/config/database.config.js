"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../user/user.entity");
exports.default = (0, config_1.registerAs)('database', () => ({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT, 10) || 35432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [user_entity_1.default],
    migrations: [`${__dirname}/../database/migrations/*.{ts,js}`],
    migrationsTableName: 'migrations'
}));
//# sourceMappingURL=database.config.js.map