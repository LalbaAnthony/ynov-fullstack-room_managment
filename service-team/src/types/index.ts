import { Optional } from 'sequelize';

export interface TeamAttributes {
  id: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TeamCreationAttributes extends Optional<TeamAttributes, 'id' | 'createdAt' | 'updatedAt' | 'description'> {}