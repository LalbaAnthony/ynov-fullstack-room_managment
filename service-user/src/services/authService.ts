import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import User from '../models/user';
import { JwtPayload, UserAttributes, UserCreationAttributes } from '../types';

const JWT_SECRET: Secret = process.env.JWT_SECRET ?? 'supersecretkey';
const JWT_EXPIRES_IN: SignOptions['expiresIn'] = (process.env.JWT_EXPIRES_IN ?? '1h') as SignOptions['expiresIn'];

/**
 * Registers a new user.
 * Hashes the password before storing it.
 *
 * @param {UserCreationAttributes} userData - The user data for registration.
 * @returns {Promise<Partial<UserAttributes>>} The newly created user's data, excluding the password hash.
 * @throws {Error} If a user with the given email already exists.
 */
export const registerUser = async (userData: UserCreationAttributes): Promise<Partial<UserAttributes>> => {
  const { firstName, lastName, email, passwordHash, role = 'student', isFirstConnection = true } = userData;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('User with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(passwordHash, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    passwordHash: hashedPassword,
    role,
    isFirstConnection,
  });

  const userResponse: Partial<UserAttributes> = user.toJSON();
  delete userResponse.passwordHash;
  return userResponse;
};

/**
 * Authenticates a user and generates a JWT.
 *
 * @param {string} email - The user's email.
 * @param {string} passwordPlain - The user's plain text password.
 * @returns {Promise<{ token: string; user: Partial<UserAttributes> }>} The JWT and user details (excluding password hash).
 * @throws {Error} If credentials are invalid.
 */
export const loginUser = async (email: string, passwordPlain: string): Promise<{ token: string; user: Partial<UserAttributes> }> => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials. User does not exist');
  }

  const isMatch = await bcrypt.compare(passwordPlain, user.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid credentials. Not match');
  }

  const payload: JwtPayload = { userId: user.id, role: user.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return {
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isFirstConnection: user.isFirstConnection,
    },
  };
};
