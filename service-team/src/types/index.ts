import { Optional } from "sequelize";

export interface TeamAttributes {
  id: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TeamCreationAttributes = Optional<
  TeamAttributes,
  "id" | "createdAt" | "updatedAt" | "description"
>;
