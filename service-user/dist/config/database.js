"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const sequelizeProduction = new sequelize_1.Sequelize(process.env.POSTGRES_DB || '', process.env.POSTGRES_USER || '', process.env.POSTGRES_PASSWORD || '', {
    host: process.env.POSTGRES_HOST || '',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
const sequelizeDevelopment = new sequelize_1.Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: console.log,
});
exports.sequelize = process.env.NODE_ENV === 'production' ? sequelizeProduction : sequelizeDevelopment;
//# sourceMappingURL=database.js.map