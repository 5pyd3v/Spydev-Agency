import { Schema, model, type Document, type Model } from 'mongoose';

export interface IClient extends Document {
  name: string;
  logoUrl: string;
  logoDarkUrl: string;
  websiteUrl: string;
  displayOrder: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const clientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true, trim: true },
    logoUrl: { type: String, required: true },
    logoDarkUrl: { type: String, default: '' },
    websiteUrl: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

clientSchema.index({ status: 1, displayOrder: 1 });

export const Client: Model<IClient> = model<IClient>('Client', clientSchema);
