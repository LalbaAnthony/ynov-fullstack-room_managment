"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./config/database");
const user_1 = __importDefault(require("./models/user"));
// Load .env file
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const seedData = async () => {
    try {
        // Check the database connection
        await database_1.sequelize.authenticate();
        // Synchronize the database (drop all existing tables and recreate them)
        await database_1.sequelize.sync({ force: true });
        // Sample data for User table, with crypted passwords
        const sampleUsers = require('../src/seeds/users.json');
        for (const user of sampleUsers)
            user.password = await bcryptjs_1.default.hash(user.password, 10);
        await user_1.default.bulkCreate(sampleUsers);
    }
    catch (error) {
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
    }
    catch (error) {
        console.log('Error running the script');
        console.log(error);
        process.exit(1); // Terminate the script with an error
    }
    finally {
        await database_1.sequelize.close(); // Ensure the connection is closed properly
    }
})();
//# sourceMappingURL=seed.js.map