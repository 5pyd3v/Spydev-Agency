import { Schema, model, type Document, type Model, type Types } from 'mongoose';
import { seoSchema, type ISeo } from './shared/seo.schema.js';

export interface ICaseStudyMetric {
  label: string;
  value: string;
}

export interface ICaseStudyTimelineItem {
  phase: string;
  description: string;
}

export interface ICaseStudy extends Document {
  title: string;
  slug: string;
  client: string;
  coverImage: string;
  problem: string;
  strategy: string;
  solution: string;
  implementation: string;
  technologies: string[];
  results: string;
  metrics: ICaseStudyMetric[];
  images: string[];
  timeline: ICaseStudyTimelineItem[];
  testimonialQuote: string;
  testimonialAuthor: string;
  testimonialPosition: string;
  relatedProject?: Types.ObjectId;
  seo: ISeo;
  status: 'active' | 'inactive' | 'draft';
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const caseStudySchema = new Schema<ICaseStudy>(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    client: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    problem: { type: String, default: '' },
    strategy: { type: String, default: '' },
    solution: { type: String, default: '' },
    implementation: { type: String, default: '' },
    technologies: [{ type: String, trim: true }],
    results: { type: String, default: '' },
    metrics: [{ label: String, value: String, _id: false }],
    images: [{ type: String }],
    timeline: [{ phase: String, description: String, _id: false }],
    testimonialQuote: { type: String, default: '' },
    testimonialAuthor: { type: String, default: '' },
    testimonialPosition: { type: String, default: '' },
    relatedProject: { type: Schema.Types.ObjectId, ref: 'Project' },
    seo: { type: seoSchema, default: () => ({}) },
    status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'active' },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

caseStudySchema.index({ status: 1, displayOrder: 1 });

export const CaseStudy: Model<ICaseStudy> = model<ICaseStudy>('CaseStudy', caseStudySchema);
