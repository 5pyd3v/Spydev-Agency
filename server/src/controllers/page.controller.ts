import type { Request, Response } from 'express';
import sanitizeHtml from 'sanitize-html';
import { Page } from '../models/Page.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/ApiResponse.js';

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'p', 'br', 'hr', 'strong', 'em', 'u', 's', 'blockquote',
    'ul', 'ol', 'li', 'a', 'img', 'code', 'pre', 'span', 'div',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height'],
    span: ['class'],
    div: ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
};

export const getPublicPage = asyncHandler(async (req: Request, res: Response) => {
  const page = await Page.findOne({ slug: req.params.slug, status: 'active' });
  if (!page) throw ApiError.notFound('Page not found');
  sendSuccess(res, page);
});

export const listPages = asyncHandler(async (_req: Request, res: Response) => {
  const pages = await Page.find().sort({ title: 1 });
  sendSuccess(res, pages);
});

export const getAdminPage = asyncHandler(async (req: Request, res: Response) => {
  const page = await Page.findOne({ slug: req.params.slug });
  if (!page) throw ApiError.notFound('Page not found');
  sendSuccess(res, page);
});

export const upsertPage = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const body = { ...req.body };
  if (typeof body.content === 'string') body.content = sanitizeHtml(body.content, SANITIZE_OPTIONS);

  const page = await Page.findOneAndUpdate(
    { slug },
    { $set: body, $setOnInsert: { slug } },
    { new: true, upsert: true, runValidators: true }
  );

  sendSuccess(res, page, 'Page saved successfully');
});
