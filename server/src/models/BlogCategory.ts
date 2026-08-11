import { Schema, model, type Document, type Model } from 'mongoose';

export interface IBlogCategory extends Document {
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const blogCategorySchema = new Schema<IBlogCategory>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const BlogCategory: Model<IBlogCategory> = model<IBlogCategory>('BlogCategory', blogCategorySchema);
