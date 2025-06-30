import { Optional } from "sequelize";

export interface UserAttributes {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  passwordHash: string;
  role: "student" | "admin";
  isFirstConnection: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  | "id"
  | "role"
  | "isFirstConnection"
  | "createdAt"
  | "updatedAt"
  | "firstName"
  | "lastName"
>;

export interface JwtPayload {
  userId: string;
  role: "student" | "admin";
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
