import { Schema, model, type Document, type Model, type Types } from 'mongoose';

export interface IMedia extends Document {
  url: string;
  publicId: string;
  provider: 'cloudinary' | 'local';
  resourceType: 'image' | 'video' | 'raw';
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  folder: string;
  originalName: string;
  altText: string;
  uploadedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<IMedia>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    provider: { type: String, enum: ['cloudinary', 'local'], default: 'cloudinary' },
    resourceType: { type: String, enum: ['image', 'video', 'raw'], default: 'image' },
    format: { type: String, default: '' },
    bytes: { type: Number, default: 0 },
    width: { type: Number },
    height: { type: Number },
    folder: { type: String, default: 'spydev' },
    originalName: { type: String, default: '' },
    altText: { type: String, default: '' },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

mediaSchema.index({ createdAt: -1 });
mediaSchema.index({ originalName: 'text', altText: 'text' });

export const Media: Model<IMedia> = model<IMedia>('Media', mediaSchema);
