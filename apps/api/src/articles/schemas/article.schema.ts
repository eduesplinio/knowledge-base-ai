import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Article extends Document {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  content!: string;

  @Prop({ type: Types.ObjectId, ref: 'Space', required: true })
  spaceId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId!: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ type: [Number] })
  content_vector?: number[];

  @Prop({ type: String, enum: ['DRAFT', 'IN_REVIEW', 'PUBLISHED'] })
  status?: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

ArticleSchema.index({ spaceId: 1 });
ArticleSchema.index({ authorId: 1 });
ArticleSchema.index({ tags: 1 });
