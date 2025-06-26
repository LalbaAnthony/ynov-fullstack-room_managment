import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { RoomAttributes, RoomCreationAttributes } from '../types';

class Room extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes {
  public id!: string;
  public name!: string;
  public capacity!: number;
  public location!: string;
  public isAvailable!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Room.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'rooms',
    timestamps: true,
  }
);

export default Room;