import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { cookieNames, verifyAccessToken } from '../utils/jwt.js';
import type { UserRole } from '../models/User.js';

export function protect(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[cookieNames.ACCESS_COOKIE];
  if (!token) return next(ApiError.unauthorized('Authentication required'));

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    next(ApiError.unauthorized('Session expired or invalid — please log in again'));
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized('Authentication required'));
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission to perform this action'));
    }
    next();
  };
}

/**
 * Double-submit CSRF check for cookie-authenticated mutating requests.
 * The SPA reads the non-httpOnly `spydev_csrf` cookie and echoes it in the
 * `x-csrf-token` header; a mismatch means the request didn't originate from
 * a page that can read our cookies (i.e. not a forged cross-site request).
 */
export function csrfProtect(req: Request, _res: Response, next: NextFunction) {
  const cookieToken = req.cookies?.[cookieNames.CSRF_COOKIE];
  const headerToken = req.headers['x-csrf-token'];
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return next(ApiError.forbidden('Invalid or missing CSRF token'));
  }
  next();
}
