import { Schema, model, type Document, type Model, type Types } from 'mongoose';
import { seoSchema, type ISeo } from './shared/seo.schema.js';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category?: Types.ObjectId;
  tags: string[];
  author?: Types.ObjectId;
  status: 'draft' | 'published';
  publishedAt?: Date;
  seo: ISeo;
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    excerpt: { type: String, default: '', maxlength: 300 },
    content: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    category: { type: Schema.Types.ObjectId, ref: 'BlogCategory' },
    tags: [{ type: String, trim: true }],
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    publishedAt: { type: Date },
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true }
);

blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ title: 'text', excerpt: 'text' });

export const BlogPost: Model<IBlogPost> = model<IBlogPost>('BlogPost', blogPostSchema);
