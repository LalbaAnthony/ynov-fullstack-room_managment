import { NextFunction, Request, Response } from "express";
import * as authService from "../services/authService";

export const healthCheck = (req: Request, res: Response) => {
  res.status(200).json({ message: "Service is healthyHEYYYYYYY" });
};

/**
 * Handles user registration.
 *
 * @param {Request} req - The Express request object, expecting firstName, lastName, email, and password in the body.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required." });
      return;
    }

    const newUser = await authService.registerUser({
      firstName,
      lastName,
      email,
      passwordHash: password,
      role,
    });
    res
      .status(201)
      .json({ message: "User registered successfully.", user: newUser });
  } catch (error: any) {
    console.error("Registration error:", error);

    res
      .status(400)
      .json({ message: error.message || "Error registering user." });
  }
};

/**
 * Handles user login.
 *
 * @param {Request} req - The Express request object, expecting email and password in the body.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required." });
  }

  const { token, user } = await authService.loginUser(email, password);

  res.status(200).json({ message: "Login successful.", token, user });
};
