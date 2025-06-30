import { NextFunction, Request, Response } from "express";
import jwt, {
  JsonWebTokenError,
  Secret,
  TokenExpiredError,
} from "jsonwebtoken";
import { JwtPayload } from "../types";

const JWT_SECRET: Secret = process.env.JWT_SECRET ?? "supersecretkey";

/**
 * Middleware to authenticate requests using JWT.
 * Verifies the token and attaches user ID and role to the request object.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
// Pour être plus explicite, on peut ajouter le type de retour : void
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    // On enlève le "return" ici
    res.status(401).json({ message: "Authentication token required." });
    return; // On peut mettre un return vide pour stopper l'exécution de la fonction
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        // On enlève le "return" ici
        res.status(403).json({ message: "Token expired." });
        return;
      }
      if (err instanceof JsonWebTokenError) {
        // On enlève le "return" ici
        res.status(403).json({ message: "Invalid token." });
        return;
      }
      // On enlève le "return" ici
      res.status(403).json({ message: "Forbidden." });
      return;
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

/**
 * Middleware to authorize requests based on user role.
 * Ensures that the authenticated user has one of the allowed roles.
 *
 * @param {('student' | 'admin')[]} allowedRoles - An array of roles that are allowed to access the route.
 * @returns {Function} An Express middleware function.
 */
export const authorizeRoles = (allowedRoles: ("student" | "admin")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      res.status(403).json({ message: "Access denied. User role not found." });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
      return;
    }

    next();
  };
};
