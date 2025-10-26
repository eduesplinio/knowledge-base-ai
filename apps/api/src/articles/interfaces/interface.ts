import { Document, Types } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  content: string;
  spaceId: Types.ObjectId;
  authorId: Types.ObjectId;
  tags: string[];
  content_vector?: number[] | null;
  createdAt: Date;
  updatedAt: Date;
}
