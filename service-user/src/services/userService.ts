import bcrypt from "bcryptjs";
import User from "../models/user";
import { UserAttributes, UserCreationAttributes } from "../types";

/**
 * Retrieves all users from the database.
 * Excludes the password hash from the returned user objects.
 *
 * @returns {Promise<Partial<UserAttributes>[]>} A promise that resolves to an array of user objects.
 */
export const getAllUsers = async (): Promise<Partial<UserAttributes>[]> => {
  const users = await User.findAll({
    attributes: { exclude: ["passwordHash"] },
  });
  return users.map((user) => user.toJSON());
};

/**
 * Get User by ID
 *
 * @param {string} userId - The ID of the user to get.
 * @returns {Promise<Partial<UserAttributes>>}
 * @throws {Error}
 */
export const getUser = async (
  userId: string,
): Promise<Partial<UserAttributes>> => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["passwordHash"] },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};

/**
 * Creates a new user.
 * Hashes the password before storing it.
 *
 * @param {UserCreationAttributes} userData - The data for the new user.
 * @returns {Promise<Partial<UserAttributes>>} A promise that resolves to the newly created user object (without password hash).
 * @throws {Error} If a user with the given email already exists.
 */
export const createUser = async (
  userData: UserCreationAttributes,
): Promise<Partial<UserAttributes>> => {
  const existingUser = await User.findOne({ where: { email: userData.email } });
  if (existingUser) {
    throw new Error("User with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(userData.passwordHash, 10);

  const newUser = await User.create({
    ...userData,
    passwordHash: hashedPassword,
  });

  const userResponse: Partial<UserAttributes> = newUser.toJSON();
  delete userResponse.passwordHash;
  return userResponse;
};

/**
 * Updates an existing user.
 * If a new password is provided, it will be hashed.
 *
 * @param {string} userId - The ID of the user to update.
 * @param {Partial<UserAttributes>} userData - The updated user data.
 * @returns {Promise<Partial<UserAttributes>>} A promise that resolves to the updated user object (without password hash).
 * @throws {Error} If the user is not found or if the email already exists for another user.
 */
export const updateUser = async (
  userId: string,
  userData: Partial<UserAttributes>,
): Promise<Partial<UserAttributes>> => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found.");
  }

  if (userData.email && userData.email !== user.email) {
    const existingUser = await User.findOne({
      where: { email: userData.email },
    });
    if (existingUser && existingUser.id !== userId) {
      throw new Error("Email already in use by another user.");
    }
  }

  if (userData.passwordHash) {
    userData.passwordHash = await bcrypt.hash(userData.passwordHash, 10);
  }

  await user.update(userData);

  const userResponse: Partial<UserAttributes> = user.toJSON();
  delete userResponse.passwordHash;
  return userResponse;
};

/**
 * Deletes a user by ID.
 *
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise<void>} A promise that resolves if the user is deleted successfully.
 * @throws {Error} If the user is not found.
 */
export const deleteUser = async (userId: string): Promise<void> => {
  const result = await User.destroy({
    where: { id: userId },
  });

  if (result === 0) {
    throw new Error("User not found.");
  }
};
