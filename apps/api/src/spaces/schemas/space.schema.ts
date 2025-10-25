import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Space extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId!: Types.ObjectId;

  @Prop({ type: Object })
  settings?: {
    primaryColor?: string;
    logo?: string;
  };
}

export const SpaceSchema = SchemaFactory.createForClass(Space);

SpaceSchema.index({ authorId: 1 });
