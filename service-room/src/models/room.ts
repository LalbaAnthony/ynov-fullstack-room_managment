import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { RoomAttributes, RoomCreationAttributes } from '../types';

interface RoomInstance extends Model<RoomAttributes, RoomCreationAttributes>, RoomAttributes { }

const Room = sequelize.define<RoomInstance>('Room', {
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
    tableName: 'rooms',
    timestamps: true,
});

export default Room;
