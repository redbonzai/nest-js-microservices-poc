import mongoose from 'mongoose';
import { Role } from '@app/common/roles/interfaces/role.interface';

export interface User extends mongoose.Document {
  email: string;
  password: string;
  roles?: Role[];
}
