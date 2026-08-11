import { Schema, model, type Document, type Model } from 'mongoose';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal-sent' | 'won' | 'lost';
export type LeadSource = 'contact' | 'start-project';

export interface ILeadNote {
  text: string;
  createdAt: Date;
}

export interface ILead extends Document {
  source: LeadSource;
  name: string;
  email: string;
  phone: string;
  company: string;
  // contact form
  service: string;
  budget: string;
  message: string;
  // start-a-project form
  projectType: string;
  projectDescription: string;
  timeline: string;
  requiredTechnologies: string[];
  referenceLinks: string[];
  // pipeline
  status: LeadStatus;
  isRead: boolean;
  notes: ILeadNote[];
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    source: { type: String, enum: ['contact', 'start-project'], required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },

    service: { type: String, default: '' },
    budget: { type: String, default: '' },
    message: { type: String, default: '' },

    projectType: { type: String, default: '' },
    projectDescription: { type: String, default: '' },
    timeline: { type: String, default: '' },
    requiredTechnologies: [{ type: String }],
    referenceLinks: [{ type: String }],

    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'proposal-sent', 'won', 'lost'],
      default: 'new',
    },
    isRead: { type: Boolean, default: false },
    notes: [{ text: String, createdAt: { type: Date, default: Date.now }, _id: false }],
  },
  { timestamps: true }
);

leadSchema.index({ status: 1, createdAt: -1 });
leadSchema.index({ isRead: 1 });
leadSchema.index({ name: 'text', email: 'text', company: 'text' });

export const Lead: Model<ILead> = model<ILead>('Lead', leadSchema);
