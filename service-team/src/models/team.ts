import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { TeamAttributes, TeamCreationAttributes } from '../types';

interface TeamInstance extends Model<TeamAttributes, TeamCreationAttributes>, TeamAttributes { }

const Team = sequelize.define<TeamInstance>('Team', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 50]
        }
    },
}, {
    tableName: 'teams',
    timestamps: true,
});

export default Team;
