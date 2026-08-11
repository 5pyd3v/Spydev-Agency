import type { Request, Response } from 'express';
import sanitizeHtml from 'sanitize-html';
import { BlogPost } from '../models/BlogPost.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { getPagination, buildMeta } from '../utils/pagination.js';
import { generateUniqueSlug } from '../utils/slugify.js';

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
    code: ['class'],
    pre: ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
};

const publicPopulate = ['category', 'author'] as const;

export const listPublicPosts = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req, 9, 30);
  const filter: Record<string, unknown> = { status: 'published', publishedAt: { $lte: new Date() } };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.tag) filter.tags = req.query.tag;

  const [items, total] = await Promise.all([
    BlogPost.find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('category', 'name slug')
      .populate('author', 'name avatar'),
    BlogPost.countDocuments(filter),
  ]);

  sendSuccess(res, items, 'Posts fetched', 200, buildMeta(page, limit, total));
});

export const getPublicPostBySlug = asyncHandler(async (req: Request, res: Response) => {
  const post = await BlogPost.findOne({
    status: 'published',
    publishedAt: { $lte: new Date() },
    slug: req.params.slug,
  })
    .populate('category', 'name slug')
    .populate('author', 'name avatar');

  if (!post) throw ApiError.notFound('Post not found');
  sendSuccess(res, post);
});

export const listAdminPosts = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req);
  const search = String(req.query.search ?? '').trim();

  const filter: Record<string, unknown> = {};
  if (search) filter.$text = { $search: search };
  if (req.query.status) filter.status = req.query.status;

  const [items, total] = await Promise.all([
    BlogPost.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('category', 'name slug')
      .populate('author', 'name avatar'),
    BlogPost.countDocuments(filter),
  ]);

  sendSuccess(res, items, 'Posts fetched', 200, buildMeta(page, limit, total));
});

export const getAdminPost = asyncHandler(async (req: Request, res: Response) => {
  const post = await BlogPost.findById(req.params.id).populate(publicPopulate as unknown as string[]);
  if (!post) throw ApiError.notFound('Post not found');
  sendSuccess(res, post);
});

function applyPublishTransition(body: Record<string, unknown>, previousStatus?: string) {
  if (body.status === 'published' && !body.publishedAt && previousStatus !== 'published') {
    body.publishedAt = new Date();
  }
}

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const body: Record<string, unknown> = { ...req.body, author: req.user?.id };
  body.slug = await generateUniqueSlug(BlogPost, (body.slug as string) || (body.title as string));
  if (typeof body.content === 'string') body.content = sanitizeHtml(body.content, SANITIZE_OPTIONS);
  applyPublishTransition(body);

  const post = await BlogPost.create(body);
  sendSuccess(res, post, 'Post created successfully', 201);
});

export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) throw ApiError.notFound('Post not found');

  const body: Record<string, unknown> = { ...req.body };
  if (body.slug) body.slug = await generateUniqueSlug(BlogPost, body.slug as string, req.params.id);
  if (typeof body.content === 'string') body.content = sanitizeHtml(body.content, SANITIZE_OPTIONS);
  applyPublishTransition(body, post.status);

  Object.assign(post, body);
  await post.save();
  sendSuccess(res, post, 'Post updated successfully');
});

export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) throw ApiError.notFound('Post not found');
  await post.deleteOne();
  sendSuccess(res, null, 'Post deleted successfully');
});
