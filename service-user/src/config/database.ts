import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
    // TODO: Chg env vars it fo fit docker conf
    process.env.POSTGRES_DB || '',
    process.env.POSTGRES_USER || '',
    process.env.POSTGRES_PASSWORD || '',
    {
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
    }
);

