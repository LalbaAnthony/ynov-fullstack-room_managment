import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import User from '../models/user';
import { JwtPayload, UserCreationAttributes } from '../types';

const JWT_SECRET: Secret = process.env.JWT_SECRET ?? 'supersecretkey';
const JWT_EXPIRES_IN: SignOptions['expiresIn'] = (process.env.JWT_EXPIRES_IN ?? '1h') as SignOptions['expiresIn']


export const registerUser = async (userData: UserCreationAttributes) => {
  const { username, email, passwordHash, role = 'user', isFirstConnection = true } = userData;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('User with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(passwordHash, 10);

  const user = await User.create({
    username,
    email,
    passwordHash: hashedPassword,
    role,
    isFirstConnection
  });

  const userResponse: any = user.toJSON();
  delete userResponse.passwordHash;
  return userResponse;
};

export const loginUser = async (email: string, passwordPlain: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials.');
  }

  const isMatch = await bcrypt.compare(passwordPlain, user.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid credentials.');
  }

  const payload: JwtPayload = { userId: user.id, role: user.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return { token, user: { id: user.id, username: user.username, email: user.email, role: user.role, isFirstConnection: user.isFirstConnection } };

};

export const markUserAsConnected = async (userId: string) => {
  const user = await User.findByPk(userId);
  if (user && user.isFirstConnection) {
    user.isFirstConnection = false;
    await user.save();
  }
};