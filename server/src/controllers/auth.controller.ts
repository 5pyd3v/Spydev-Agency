import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { User } from '../models/User.js';
import {
  clearAuthCookies,
  cookieNames,
  setAuthCookies,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';

const LOCK_THRESHOLD = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

function publicUser(user: {
  id?: string;
  _id?: unknown;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}) {
  return {
    id: user.id ?? String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar ?? '',
  };
}

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password +failedLoginAttempts +lockedUntil');
  if (!user) throw ApiError.unauthorized('Invalid email or password');

  if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
    const minutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    throw ApiError.forbidden(`Account temporarily locked. Try again in ${minutes} minute(s).`);
  }

  if (!user.isActive) throw ApiError.forbidden('This account has been deactivated');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    user.failedLoginAttempts = (user.failedLoginAttempts ?? 0) + 1;
    if (user.failedLoginAttempts >= LOCK_THRESHOLD) {
      user.lockedUntil = new Date(Date.now() + LOCK_DURATION_MS);
      user.failedLoginAttempts = 0;
    }
    await user.save();
    throw ApiError.unauthorized('Invalid email or password');
  }

  user.failedLoginAttempts = 0;
  user.lockedUntil = undefined;
  user.lastLoginAt = new Date();
  await user.save();

  const payload = { id: String(user._id), role: user.role, email: user.email, name: user.name };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ id: String(user._id) });
  setAuthCookies(res, accessToken, refreshToken);

  sendSuccess(res, { user: publicUser({ ...payload, avatar: user.avatar }) }, 'Logged in successfully');
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  clearAuthCookies(res);
  sendSuccess(res, null, 'Logged out successfully');
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const user = await User.findById(req.user.id);
  if (!user || !user.isActive) throw ApiError.unauthorized('Session no longer valid');
  sendSuccess(res, { user: publicUser(user) });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[cookieNames.REFRESH_COOKIE];
  if (!token) throw ApiError.unauthorized('No refresh token provided');

  let decoded: { id: string };
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw ApiError.unauthorized('Refresh token expired or invalid — please log in again');
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) throw ApiError.unauthorized('Account no longer available');

  const payload = { id: String(user._id), role: user.role, email: user.email, name: user.name };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ id: String(user._id) });
  setAuthCookies(res, accessToken, refreshToken);

  sendSuccess(res, { user: publicUser(user) }, 'Session refreshed');
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');
  if (!user) throw ApiError.unauthorized();

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw ApiError.badRequest('Current password is incorrect');

  user.password = newPassword;
  await user.save();

  sendSuccess(res, null, 'Password updated successfully');
});
