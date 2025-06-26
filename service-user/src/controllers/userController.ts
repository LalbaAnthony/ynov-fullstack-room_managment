import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/userService';

/**
 * Retrieves all users.
 * Accessible only by 'admin' role.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  const users = await userService.getAllUsers();
  res.status(200).json(users);
};

/**
 * Adds a new user.
 * Accessible only by 'admin' role.
 *
 * @param {Request} req - The Express request object, expecting firstName, lastName, email, password, and optional role in the body.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const addUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required to create a user.' });
      return;
    }

    const newUser = await userService.createUser({
      firstName,
      lastName,
      email,
      passwordHash: password,
      role,
    });
    res.status(201).json({ message: 'User created successfully.', user: newUser });
  } catch (error: any) {
    console.error('Error adding user:', error);

    res.status(error.message.includes('already exists') ? 400 : 500).json({ message: error.message || 'Error adding user.' });
  }
};

/**
 * Updates an existing user.
 * Accessible only by 'admin' role.
 *
 * @param {Request} req - The Express request object, expecting user ID in params and updated data in body.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;


    if (updateData.password) {
      updateData.passwordHash = updateData.password;
      delete updateData.password;
    }

    const updatedUser = await userService.updateUser(userId, updateData);
    res.status(200).json({ message: 'User updated successfully.', user: updatedUser });
  } catch (error: any) {
    console.error('Error updating user:', error);

    let statusCode = 500;
    if (error.message.includes('User not found')) {
      statusCode = 404;
    } else if (error.message.includes('Email already in use')) {
      statusCode = 400;
    }
    res.status(statusCode).json({ message: error.message || 'Error updating user.' });
  }
};

/**
 * Deletes a user.
 * Accessible only by 'admin' role.
 *
 * @param {Request} req - The Express request object, expecting user ID in params.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    await userService.deleteUser(userId);
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting user:', error);

    res.status(error.message.includes('User not found') ? 404 : 500).json({ message: error.message || 'Error deleting user.' });
  }
};
