import { Schema, model, type Document, type Model } from 'mongoose';

export interface IProcessStep extends Document {
  title: string;
  description: string;
  icon: string;
  displayOrder: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const processStepSchema = new Schema<IProcessStep>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'circle-dot' },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

processStepSchema.index({ status: 1, displayOrder: 1 });

export const ProcessStep: Model<IProcessStep> = model<IProcessStep>('ProcessStep', processStepSchema);
