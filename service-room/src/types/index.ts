import { Optional } from 'sequelize';

export interface RoomAttributes {
  id: string;
  name: string;
  capacity: number;
  location: string;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoomCreationAttributes extends Optional<RoomAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isAvailable'> { }