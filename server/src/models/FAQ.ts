import { Schema, model, type Document, type Model } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const faqSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    category: { type: String, default: 'General' },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

faqSchema.index({ status: 1, displayOrder: 1 });

export const FAQ: Model<IFAQ> = model<IFAQ>('FAQ', faqSchema);
