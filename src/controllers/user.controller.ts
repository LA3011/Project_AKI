import { type Request, type Response, type NextFunction } from 'express';
import * as UserService from '../services/user.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getUsers = catchAsync(async (_req: Request, res: Response) => {
  const users = await UserService.getAllUsers();
  res.status(200).json({ success: true, data: users });
});
