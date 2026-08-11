import { Schema, model, type Document, type Model } from 'mongoose';

export interface ITeamMember extends Document {
  name: string;
  position: string;
  profileImage: string;
  shortBio: string;
  fullBio: string;
  skills: string[];
  linkedin: string;
  github: string;
  otherLinks: { platform: string; url: string }[];
  displayOrder: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const teamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    profileImage: { type: String, default: '' },
    shortBio: { type: String, default: '' },
    fullBio: { type: String, default: '' },
    skills: [{ type: String, trim: true }],
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    otherLinks: [{ platform: String, url: String, _id: false }],
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

teamMemberSchema.index({ status: 1, displayOrder: 1 });

export const TeamMember: Model<ITeamMember> = model<ITeamMember>('TeamMember', teamMemberSchema);
