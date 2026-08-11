import { Schema, model, type Document, type Model } from 'mongoose';

export type TechnologyCategory = 'frontend' | 'backend' | 'mobile' | 'database' | 'ai' | 'devops' | 'security' | 'other';

export interface ITechnology extends Document {
  name: string;
  icon: string;
  category: TechnologyCategory;
  displayOrder: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const technologySchema = new Schema<ITechnology>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    icon: { type: String, default: '' },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'mobile', 'database', 'ai', 'devops', 'security', 'other'],
      default: 'other',
    },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

technologySchema.index({ status: 1, displayOrder: 1 });

export const Technology: Model<ITechnology> = model<ITechnology>('Technology', technologySchema);
