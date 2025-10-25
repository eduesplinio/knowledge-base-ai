import { Document, Types } from 'mongoose';

export interface ISpace extends Document {
  name: string;
  description?: string;
  authorId: Types.ObjectId;
  settings?: {
    primaryColor?: string;
    logo?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
