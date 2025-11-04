import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Article extends Document {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  content!: string;

  @Prop({ required: true })
  spaceId!: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId!: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ type: [Number], default: null })
  content_vector?: number[] | null;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

ArticleSchema.index({ spaceId: 1 });
ArticleSchema.index({ authorId: 1 });
ArticleSchema.index({ tags: 1 });
