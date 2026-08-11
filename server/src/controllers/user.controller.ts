import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { User } from '../models/User.js';
import { getPagination, buildMeta } from '../utils/pagination.js';

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req);
  const search = String(req.query.search ?? '').trim();

  const filter: Record<string, unknown> = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (req.query.role) filter.role = req.query.role;

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  sendSuccess(res, users, 'Users fetched', 200, buildMeta(page, limit, total));
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound('User not found');
  sendSuccess(res, user);
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const existing = await User.findOne({ email: req.body.email });
  if (existing) throw ApiError.conflict('A user with this email already exists');

  const user = await User.create(req.body);
  sendSuccess(res, user, 'User created successfully', 201);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound('User not found');

  if (user.role === 'superadmin' && req.body.role && req.body.role !== 'superadmin') {
    const superadminCount = await User.countDocuments({ role: 'superadmin' });
    if (superadminCount <= 1) throw ApiError.badRequest('At least one Super Admin must remain');
  }

  Object.assign(user, req.body);
  await user.save();
  sendSuccess(res, user, 'User updated successfully');
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.id === req.params.id) throw ApiError.badRequest('You cannot delete your own account');

  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound('User not found');

  if (user.role === 'superadmin') {
    const superadminCount = await User.countDocuments({ role: 'superadmin' });
    if (superadminCount <= 1) throw ApiError.badRequest('At least one Super Admin must remain');
  }

  await user.deleteOne();
  sendSuccess(res, null, 'User deleted successfully');
});

export const resetUserPassword = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select('+password');
  if (!user) throw ApiError.notFound('User not found');

  user.password = req.body.newPassword;
  await user.save();
  sendSuccess(res, null, 'Password reset successfully');
});
