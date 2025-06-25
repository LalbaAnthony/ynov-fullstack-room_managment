import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { sequelize } from './config/database';
import User from './models/user';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedData = async () => {
    try {
        // Check the database connection
        await sequelize.authenticate();

        // Synchronize the database (drop all existing tables and recreate them)
        await sequelize.sync({ force: true });

        // Sample data for User table, with crypted passwords
        const sampleUsers = require('../src/seeds/users.json');
        for (const user of sampleUsers) user.password = await bcrypt.hash(user.password, 10);
        await User.bulkCreate(sampleUsers);
    } catch (error) {
        console.log('Error seeding data');
        console.log(error);
        throw error;
    }
};

(async () => {
    try {
        await seedData();
        console.log('Data seeding completed');
        process.exit(0); // Terminate the script
    } catch (error) {
        console.log('Error running the script');
        console.log(error);
        process.exit(1); // Terminate the script with an error
    } finally {
        await sequelize.close(); // Ensure the connection is closed properly
    }
})();