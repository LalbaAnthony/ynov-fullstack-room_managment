// service-team/src/types/index.ts
import { Optional } from 'sequelize';

export interface TeamAttributes {
  id: string;
  name: string;
  description?: string; // Description optionnelle
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TeamCreationAttributes extends Optional<TeamAttributes, 'id' | 'createdAt' | 'updatedAt' | 'description'> {}