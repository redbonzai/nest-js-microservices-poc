import mongoose from 'mongoose';

export interface Permission extends mongoose.Document {
  name: string;

  description?: string;
}
