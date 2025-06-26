import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const {
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_HOST,
    POSTGRES_PORT,
    DATABASE_URL,
    NODE_ENV
} = process.env;

const connectionString = DATABASE_URL || `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
        ssl: {
            require: false,
            rejectUnauthorized: false
        }
    }
});

async function connectToDatabase() {
    try {
        await new Promise(resolve => setTimeout(resolve, 15000));

        await sequelize.authenticate();
        console.log(`Connection to PostgreSQL (${process.env.SERVICE_NAME || 'Service'}) has been established successfully.`);
    } catch (error) {
        console.error(`Unable to connect to the database (${process.env.SERVICE_NAME || 'Service'}):`, error);
        process.exit(1);
    }
}

export { connectToDatabase, sequelize };
