import { Schema, model, Document } from 'mongoose';

// Define the interface for a User document
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatarUrl?: string;
  isOnline?: boolean;
  lastSeen?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Mongoose schema (aligning with user.schema.ts as much as practical for Mongo)
const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 32,
      trim: true,
      match: /^[a-zA-Z0-9_-]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 128,
      trim: true,
      lowercase: true,
      match: /.+\@.+\..+/,
    },
    password: { type: String, required: true, minlength: 6 },
    avatarUrl: { type: String },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: null },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export const UserModel = model<IUser>('User', UserSchema);
