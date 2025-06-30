import { Optional } from "sequelize";

export interface RoomAttributes {
  id: string;
  name: string;
  capacity: number;
  location: string;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type RoomCreationAttributes = Optional<
  RoomAttributes,
  "id" | "createdAt" | "updatedAt" | "isAvailable"
>;
