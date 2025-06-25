import bcrypt from 'bcryptjs';
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { UserAttributes, UserCreationAttributes } from '../types';

interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes { }

const User = sequelize.define<UserInstance>('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 50]
        }
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 50]
        }
    },
    team_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: true
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 255]
        }
    },
    role: {
        type: DataTypes.ENUM('student', 'admin'),
        defaultValue: 'student'
    },
    isFirstConnection: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'users',
    timestamps: true,
    hooks: {
        beforeCreate: async (user: UserInstance) => {
            user.password = await bcrypt.hash(user.password, 12);
        },
        beforeUpdate: async (user: UserInstance) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 12);
            }
        }
    }
});

export default User;
