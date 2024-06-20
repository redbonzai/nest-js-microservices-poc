import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

@Schema({ versionKey: false, timestamps: true })
export class PermissionDocument extends AbstractDocument {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;
}

export const PermissionSchema =
  SchemaFactory.createForClass(PermissionDocument);
