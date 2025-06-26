"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
const User = database_1.sequelize.define('User', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 50]
        }
    },
    lastname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 50]
        }
    },
    team_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: true
        }
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 255]
        }
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('student', 'admin'),
        defaultValue: 'student'
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'users',
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            user.password = await bcryptjs_1.default.hash(user.password, 12);
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await bcryptjs_1.default.hash(user.password, 12);
            }
        }
    }
});
exports.default = User;
//# sourceMappingURL=user.js.map