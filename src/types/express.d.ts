import { UserPayload } from '../interfaces/UserPayload.interface.js';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}