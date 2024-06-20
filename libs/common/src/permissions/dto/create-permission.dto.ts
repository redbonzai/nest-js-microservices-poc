import { Prop } from '@nestjs/mongoose';

export class CreatePermissionDto {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;
}
