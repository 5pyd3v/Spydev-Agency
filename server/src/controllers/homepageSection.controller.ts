import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { HomepageSection } from '../models/HomepageSection.js';

export const listPublicSections = asyncHandler(async (_req: Request, res: Response) => {
  const sections = await HomepageSection.find({ enabled: true }).sort({ order: 1 });
  sendSuccess(res, sections);
});

export const listAllSections = asyncHandler(async (_req: Request, res: Response) => {
  const sections = await HomepageSection.find().sort({ order: 1 });
  sendSuccess(res, sections);
});

export const createSection = asyncHandler(async (req: Request, res: Response) => {
  const existing = await HomepageSection.findOne({ key: req.body.key });
  if (existing) throw ApiError.conflict('A section with this key already exists');

  if (!('order' in req.body)) {
    const last = await HomepageSection.findOne().sort({ order: -1 });
    req.body.order = last ? last.order + 1 : 0;
  }

  const section = await HomepageSection.create(req.body);
  sendSuccess(res, section, 'Section created successfully', 201);
});

export const updateSection = asyncHandler(async (req: Request, res: Response) => {
  const section = await HomepageSection.findById(req.params.id);
  if (!section) throw ApiError.notFound('Section not found');

  Object.assign(section, req.body);
  await section.save();
  sendSuccess(res, section, 'Section updated successfully');
});

export const deleteSection = asyncHandler(async (req: Request, res: Response) => {
  const section = await HomepageSection.findById(req.params.id);
  if (!section) throw ApiError.notFound('Section not found');
  await section.deleteOne();
  sendSuccess(res, null, 'Section deleted successfully');
});

export const reorderSections = asyncHandler(async (req: Request, res: Response) => {
  const { items } = req.body as { items: { id: string; order: number; enabled?: boolean }[] };

  await HomepageSection.bulkWrite(
    items.map(({ id, order, enabled }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order, ...(enabled !== undefined ? { enabled } : {}) } },
      },
    }))
  );

  const sections = await HomepageSection.find().sort({ order: 1 });
  sendSuccess(res, sections, 'Section order updated');
});
