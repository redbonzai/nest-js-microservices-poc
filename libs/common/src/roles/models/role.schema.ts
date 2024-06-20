import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import * as mongoose from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class RoleDocument extends AbstractDocument {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }])
  permissions: mongoose.Types.ObjectId[];

  // @Prop( type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }])
  // permissions: mongoose.Types.ObjectId;
}

export const RoleSchema = SchemaFactory.createForClass(RoleDocument);
