import jwt from 'jsonwebtoken';
import type { Response } from 'express';
import crypto from 'node:crypto';
import { env, isProd } from '../config/env.js';
import type { UserRole } from '../models/User.js';

export interface JwtPayload {
  id: string;
  role: UserRole;
  email: string;
  name: string;
}

const ACCESS_COOKIE = 'spydev_access';
const REFRESH_COOKIE = 'spydev_refresh';
const CSRF_COOKIE = 'spydev_csrf';

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
}

export function signRefreshToken(payload: Pick<JwtPayload, 'id'>): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): { id: string } {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string };
}

// Locally, client (:5173) and server (:5000) are different ports on the same
// host — "lax" is fine there. In a typical production split (frontend on
// Vercel, API on Render), they're genuinely different sites, so cookies need
// "none" to be sent on cross-site fetch/XHR requests at all. "none" requires
// `secure: true`, which is exactly when isProd is true, so this is safe.
const crossSiteSameSite = isProd ? ('none' as const) : ('lax' as const);

const baseCookieOpts = {
  httpOnly: true,
  secure: isProd,
  sameSite: crossSiteSameSite,
  path: '/',
};

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie(ACCESS_COOKIE, accessToken, { ...baseCookieOpts, maxAge: 15 * 60 * 1000 });
  res.cookie(REFRESH_COOKIE, refreshToken, { ...baseCookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 });
  // Non-httpOnly double-submit CSRF token the SPA can read and echo back as a header.
  const csrfToken = crypto.randomBytes(32).toString('hex');
  res.cookie(CSRF_COOKIE, csrfToken, {
    httpOnly: false,
    secure: isProd,
    sameSite: crossSiteSameSite,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookies(res: Response) {
  // Browsers match cookies to clear by name + path + domain; some also expect
  // sameSite/secure to line up with how the cookie was set, so pass the same
  // attributes here rather than defaults.
  res.clearCookie(ACCESS_COOKIE, { path: '/', secure: isProd, sameSite: crossSiteSameSite });
  res.clearCookie(REFRESH_COOKIE, { path: '/', secure: isProd, sameSite: crossSiteSameSite });
  res.clearCookie(CSRF_COOKIE, { path: '/', secure: isProd, sameSite: crossSiteSameSite });
}

export const cookieNames = { ACCESS_COOKIE, REFRESH_COOKIE, CSRF_COOKIE };
