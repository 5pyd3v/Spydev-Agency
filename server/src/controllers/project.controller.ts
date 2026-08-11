import type { Request, Response } from 'express';
import { Project } from '../models/Project.js';
import { createCrudController } from '../utils/crudFactory.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { getPagination, buildMeta } from '../utils/pagination.js';

const base = createCrudController(Project, {
  resourceName: 'Project',
  searchFields: ['name', 'client', 'description'],
  publicFilter: { status: 'active' },
  slugSource: 'name',
});

// Public list supports category filtering + pagination — the base factory's
// listPublic doesn't, so Projects gets a tailored version; everything else
// (admin CRUD, reorder) reuses the factory as-is.
const listPublic = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req, 12, 48);
  const filter: Record<string, unknown> = { status: 'active' };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.featured === 'true') filter.featured = true;

  const [items, total] = await Promise.all([
    Project.find(filter).sort({ displayOrder: 1, createdAt: -1 }).skip(skip).limit(limit),
    Project.countDocuments(filter),
  ]);

  sendSuccess(res, items, 'Projects fetched', 200, buildMeta(page, limit, total));
});

const getPublicBySlug = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findOne({ status: 'active', slug: req.params.slug });
  if (!project) throw ApiError.notFound('Project not found');
  sendSuccess(res, project);
});

export const projectController = { ...base, listPublic, getPublicBySlug };
