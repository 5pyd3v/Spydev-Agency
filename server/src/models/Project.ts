import { Schema, model, type Document, type Model } from 'mongoose';
import { seoSchema, type ISeo } from './shared/seo.schema.js';

export type ProjectCategory = 'web' | 'mobile' | 'ai' | 'saas' | 'cybersecurity' | 'ecommerce';

export interface IProject extends Document {
  name: string;
  slug: string;
  client: string;
  category: ProjectCategory;
  description: string;
  challenge: string;
  solution: string;
  results: string;
  technologies: string[];
  screenshots: string[];
  coverImage: string;
  projectUrl: string;
  githubUrl: string;
  completionDate?: Date;
  featured: boolean;
  seo: ISeo;
  status: 'active' | 'inactive' | 'draft';
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    client: { type: String, default: '' },
    category: {
      type: String,
      enum: ['web', 'mobile', 'ai', 'saas', 'cybersecurity', 'ecommerce'],
      default: 'web',
    },
    description: { type: String, required: true },
    challenge: { type: String, default: '' },
    solution: { type: String, default: '' },
    results: { type: String, default: '' },
    technologies: [{ type: String, trim: true }],
    screenshots: [{ type: String }],
    coverImage: { type: String, default: '' },
    projectUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    completionDate: { type: Date },
    featured: { type: Boolean, default: false },
    seo: { type: seoSchema, default: () => ({}) },
    status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'active' },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

projectSchema.index({ status: 1, category: 1, displayOrder: 1 });
projectSchema.index({ featured: 1 });

export const Project: Model<IProject> = model<IProject>('Project', projectSchema);
