import { Schema, model, type Document, type Model } from 'mongoose';
import { seoSchema, type ISeo } from './shared/seo.schema.js';

export interface IPage extends Document {
  slug: string;
  title: string;
  content: string;
  seo: ISeo;
  status: 'active' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

const pageSchema = new Schema<IPage>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, default: '' },
    seo: { type: seoSchema, default: () => ({}) },
    status: { type: String, enum: ['active', 'draft'], default: 'active' },
  },
  { timestamps: true }
);

export const Page: Model<IPage> = model<IPage>('Page', pageSchema);
