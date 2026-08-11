import { Schema, model, type Document, type Model } from 'mongoose';

export type HomepageSectionType =
  | 'hero'
  | 'clients'
  | 'services'
  | 'stats'
  | 'projects'
  | 'process'
  | 'technologies'
  | 'about'
  | 'testimonials'
  | 'pricing'
  | 'faq'
  | 'cta'
  | 'custom';

export interface IHomepageSection extends Document {
  type: HomepageSectionType;
  key: string;
  enabled: boolean;
  order: number;
  heading: string;
  subheading: string;
  /** Free-form, type-specific configuration (hero copy, CTA buttons, custom body, etc.) */
  content: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const homepageSectionSchema = new Schema<IHomepageSection>(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'hero',
        'clients',
        'services',
        'stats',
        'projects',
        'process',
        'technologies',
        'about',
        'testimonials',
        'pricing',
        'faq',
        'cta',
        'custom',
      ],
    },
    key: { type: String, required: true, unique: true, trim: true },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    heading: { type: String, default: '' },
    subheading: { type: String, default: '' },
    content: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

homepageSectionSchema.index({ order: 1 });

export const HomepageSection: Model<IHomepageSection> = model<IHomepageSection>(
  'HomepageSection',
  homepageSectionSchema
);
