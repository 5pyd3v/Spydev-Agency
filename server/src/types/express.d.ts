import type { UserRole } from '../models/User.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        email: string;
        name: string;
      };
    }
  }
}

export {};
