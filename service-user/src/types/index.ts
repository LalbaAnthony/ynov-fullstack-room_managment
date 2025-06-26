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

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | "id"
    | "role"
    | "isFirstConnection"
    | "createdAt"
    | "updatedAt"
    | "firstName"
    | "lastName"
  > {}

export interface JwtPayload {
  userId: string;
  role: "student" | "admin";
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
