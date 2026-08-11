import { Schema, model, type Document, type Model } from 'mongoose';

export interface ITestimonial extends Document {
  clientName: string;
  company: string;
  position: string;
  avatar: string;
  testimonial: string;
  rating: number;
  featured: boolean;
  displayOrder: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    clientName: { type: String, required: true, trim: true },
    company: { type: String, default: '' },
    position: { type: String, default: '' },
    avatar: { type: String, default: '' },
    testimonial: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

testimonialSchema.index({ status: 1, displayOrder: 1 });

export const Testimonial: Model<ITestimonial> = model<ITestimonial>('Testimonial', testimonialSchema);
