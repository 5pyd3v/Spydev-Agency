import { Schema, model, type Document, type Model, type Types } from 'mongoose';
import { seoSchema, type ISeo } from './shared/seo.schema.js';

export interface IServiceFeature {
  title: string;
  description: string;
  icon: string;
}

export interface IServiceProcessStep {
  title: string;
  description: string;
}

export interface IServiceFaq {
  question: string;
  answer: string;
}

export interface IService extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  heroImage: string;
  gallery: string[];
  features: IServiceFeature[];
  technologies: string[];
  process: IServiceProcessStep[];
  faqs: IServiceFaq[];
  relatedProjects: Types.ObjectId[];
  ctaText: string;
  ctaUrl: string;
  seo: ISeo;
  status: 'active' | 'inactive' | 'draft';
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    shortDescription: { type: String, required: true, trim: true, maxlength: 300 },
    fullDescription: { type: String, default: '' },
    icon: { type: String, default: 'code-2' },
    heroImage: { type: String, default: '' },
    gallery: [{ type: String }],
    features: [
      {
        title: { type: String, required: true, trim: true },
        description: { type: String, default: '' },
        icon: { type: String, default: 'sparkles' },
        _id: false,
      },
    ],
    technologies: [{ type: String, trim: true }],
    process: [
      {
        title: { type: String, required: true, trim: true },
        description: { type: String, default: '' },
        _id: false,
      },
    ],
    faqs: [
      {
        question: { type: String, required: true, trim: true },
        answer: { type: String, default: '' },
        _id: false,
      },
    ],
    relatedProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    ctaText: { type: String, default: 'Start a project' },
    ctaUrl: { type: String, default: '/start-project' },
    seo: { type: seoSchema, default: () => ({}) },
    status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'active' },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

serviceSchema.index({ status: 1, displayOrder: 1 });

export const Service: Model<IService> = model<IService>('Service', serviceSchema);
