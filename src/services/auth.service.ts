import type { Secret, SignOptions } from 'jsonwebtoken';
import type { UserPayload } from '../interfaces/UserPayload.interface.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const SECRET: Secret = process.env.JWT_SECRET || 'default_secret_fallback';
const REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET || 'refresh_fallback';

export const generateToken = (payload: object) => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '1h'
  };

  return jwt.sign(payload, SECRET, options);
};
 
export const verifyToken = (token: string): UserPayload => {
  return jwt.verify(token, SECRET) as UserPayload;
};

export const generateRefreshToken = (payload: object) => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '7d'
  };

  return jwt.sign(payload, REFRESH_SECRET, options);
};

export const verifyRefreshToken = (token: string): UserPayload => {
  return jwt.verify(token, REFRESH_SECRET) as UserPayload;
};
 