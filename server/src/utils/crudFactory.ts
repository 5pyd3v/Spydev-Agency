import type { Request, Response } from 'express';
import type { Model, Document } from 'mongoose';
import { asyncHandler } from './asyncHandler.js';
import { ApiError } from './ApiError.js';
import { sendSuccess } from './ApiResponse.js';
import { getPagination, buildMeta } from './pagination.js';
import { generateUniqueSlug } from './slugify.js';

interface CrudFactoryOptions {
  /** Fields matched with a case-insensitive regex when `?search=` is provided. */
  searchFields?: string[];
  /** Filter applied to public-facing list/detail endpoints, e.g. `{ status: 'active' }`. */
  publicFilter?: Record<string, unknown>;
  /** Sort applied to public list results. */
  publicSort?: Record<string, 1 | -1>;
  /** Field on the document that a slug is derived from when none is supplied. */
  slugSource?: string;
  /** Field(s) to `.populate()` on reads. */
  populate?: string | string[];
  /** Human-readable name used in messages, e.g. "Service". */
  resourceName: string;
}

export function createCrudController<T extends Document>(model: Model<T>, opts: CrudFactoryOptions) {
  const { searchFields = [], publicFilter = {}, publicSort = { displayOrder: 1 }, slugSource, populate, resourceName } = opts;

  const listPublic = asyncHandler(async (req: Request, res: Response) => {
    let query = model.find(publicFilter).sort(publicSort);
    if (populate) query = query.populate(populate as string);
    const items = await query;
    sendSuccess(res, items);
  });

  const getPublicBySlug = asyncHandler(async (req: Request, res: Response) => {
    let query = model.findOne({ ...publicFilter, slug: req.params.slug });
    if (populate) query = query.populate(populate as string);
    const item = await query;
    if (!item) throw ApiError.notFound(`${resourceName} not found`);
    sendSuccess(res, item);
  });

  const listAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, skip } = getPagination(req);
    const search = String(req.query.search ?? '').trim();

    const filter: Record<string, unknown> = {};
    if (search && searchFields.length) {
      filter.$or = searchFields.map((field) => ({ [field]: { $regex: search, $options: 'i' } }));
    }
    if (req.query.status) filter.status = req.query.status;

    let query = model.find(filter).sort({ displayOrder: 1, createdAt: -1 }).skip(skip).limit(limit);
    if (populate) query = query.populate(populate as string);

    const [items, total] = await Promise.all([query, model.countDocuments(filter)]);
    sendSuccess(res, items, `${resourceName} list fetched`, 200, buildMeta(page, limit, total));
  });

  const getById = asyncHandler(async (req: Request, res: Response) => {
    let query = model.findById(req.params.id);
    if (populate) query = query.populate(populate as string);
    const item = await query;
    if (!item) throw ApiError.notFound(`${resourceName} not found`);
    sendSuccess(res, item);
  });

  const create = asyncHandler(async (req: Request, res: Response) => {
    const body: Record<string, unknown> = { ...req.body };
    if (slugSource) {
      const source = (body.slug as string) || (body[slugSource] as string);
      body.slug = await generateUniqueSlug(model, source);
    }
    const item = await model.create(body);
    sendSuccess(res, item, `${resourceName} created successfully`, 201);
  });

  const update = asyncHandler(async (req: Request, res: Response) => {
    const item = await model.findById(req.params.id);
    if (!item) throw ApiError.notFound(`${resourceName} not found`);

    const body: Record<string, unknown> = { ...req.body };
    if (slugSource && body.slug) {
      body.slug = await generateUniqueSlug(model, body.slug as string, req.params.id);
    }

    Object.assign(item, body);
    await item.save();
    sendSuccess(res, item, `${resourceName} updated successfully`);
  });

  const remove = asyncHandler(async (req: Request, res: Response) => {
    const item = await model.findById(req.params.id);
    if (!item) throw ApiError.notFound(`${resourceName} not found`);
    await item.deleteOne();
    sendSuccess(res, null, `${resourceName} deleted successfully`);
  });

  const reorder = asyncHandler(async (req: Request, res: Response) => {
    const { items } = req.body as { items: { id: string; displayOrder: number }[] };
    await model.bulkWrite(
      items.map(({ id, displayOrder }) => ({
        updateOne: { filter: { _id: id }, update: { $set: { displayOrder } } },
      })) as any
    );
    sendSuccess(res, null, `${resourceName} order updated`);
  });

  return { listPublic, getPublicBySlug, listAdmin, getById, create, update, remove, reorder };
}
