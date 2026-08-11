import { Schema, model, type Document, type Model, type Types } from 'mongoose';

export interface INavigationItem extends Document {
  label: string;
  url: string;
  location: 'header' | 'footer';
  parent?: Types.ObjectId;
  openInNewTab: boolean;
  displayOrder: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const navigationItemSchema = new Schema<INavigationItem>(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    location: { type: String, enum: ['header', 'footer'], default: 'header' },
    parent: { type: Schema.Types.ObjectId, ref: 'NavigationItem', default: null },
    openInNewTab: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

navigationItemSchema.index({ location: 1, status: 1, displayOrder: 1 });

export const NavigationItem: Model<INavigationItem> = model<INavigationItem>('NavigationItem', navigationItemSchema);
