import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { Media } from '../models/Media.js';
import { deleteFromCloudinary, uploadBufferToCloudinary } from '../services/media.service.js';
import { getPagination, buildMeta } from '../utils/pagination.js';

export const listMedia = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req, 24, 100);
  const search = String(req.query.search ?? '').trim();

  const filter: Record<string, unknown> = {};
  if (search) filter.$text = { $search: search };

  const [items, total] = await Promise.all([
    Media.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('uploadedBy', 'name email'),
    Media.countDocuments(filter),
  ]);

  sendSuccess(res, items, 'Media fetched', 200, buildMeta(page, limit, total));
});

export const uploadMedia = asyncHandler(async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[] | undefined) ?? (req.file ? [req.file] : []);
  if (files.length === 0) throw ApiError.badRequest('No files provided');

  const folder = typeof req.body.folder === 'string' && req.body.folder ? req.body.folder : 'spydev';

  const uploaded = await Promise.all(
    files.map(async (file) => {
      const asset = await uploadBufferToCloudinary(file.buffer, folder);
      return Media.create({
        url: asset.url,
        publicId: asset.publicId,
        provider: 'cloudinary',
        resourceType: asset.resourceType,
        format: asset.format,
        bytes: asset.bytes,
        width: asset.width,
        height: asset.height,
        folder,
        originalName: file.originalname,
        uploadedBy: req.user?.id,
      });
    })
  );

  sendSuccess(res, uploaded, 'Upload successful', 201);
});

export const updateMedia = asyncHandler(async (req: Request, res: Response) => {
  const media = await Media.findById(req.params.id);
  if (!media) throw ApiError.notFound('Media not found');

  if (typeof req.body.altText === 'string') media.altText = req.body.altText;
  await media.save();

  sendSuccess(res, media, 'Media updated');
});

export const deleteMedia = asyncHandler(async (req: Request, res: Response) => {
  const media = await Media.findById(req.params.id);
  if (!media) throw ApiError.notFound('Media not found');

  await deleteFromCloudinary(media.publicId);
  await media.deleteOne();

  sendSuccess(res, null, 'Media deleted');
});
