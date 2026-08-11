import { Schema, model, type Document, type Model } from 'mongoose';

export interface IPricingPlan extends Document {
  name: string;
  price: string;
  billingPeriod: string;
  description: string;
  features: string[];
  isPopular: boolean;
  ctaText: string;
  ctaUrl: string;
  displayOrder: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const pricingPlanSchema = new Schema<IPricingPlan>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    billingPeriod: { type: String, default: 'one-time' },
    description: { type: String, default: '' },
    features: [{ type: String }],
    isPopular: { type: Boolean, default: false },
    ctaText: { type: String, default: 'Get started' },
    ctaUrl: { type: String, default: '/start-project' },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

pricingPlanSchema.index({ status: 1, displayOrder: 1 });

export const PricingPlan: Model<IPricingPlan> = model<IPricingPlan>('PricingPlan', pricingPlanSchema);
