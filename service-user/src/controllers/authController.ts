import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/authService';

/**
 * Handles user registration.
 *
 * @param {Request} req - The Express request object, expecting firstName, lastName, email, and password in the body.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }


    const newUser = await authService.registerUser({ firstName, lastName, email, passwordHash: password, role });
    res.status(201).json({ message: 'User registered successfully.', user: newUser });
  } catch (error: any) {
    console.error('Registration error:', error);

    res.status(400).json({ message: error.message || 'Error registering user.' });
  }
};

/**
 * Handles user login.
 *
 * @param {Request} req - The Express request object, expecting email and password in the body.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt with email:', email);

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const { token, user } = await authService.loginUser(email, password);

    console.log('Login successful for user:', user.email);

    res.status(200).json({ message: 'Login successful.', token, user });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(401).json({ message: error.message || 'Invalid credentials.' });
  }
};
