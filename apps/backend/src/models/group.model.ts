import { Schema, model, Document, Types } from 'mongoose';

// Define the interface for a Group document
export interface IGroup extends Document {
  name: string;
  description?: string;
  members: Types.ObjectId[]; // references User _id
  createdBy: Types.ObjectId; // User who created the group
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Mongoose schema for Group
const GroupSchema = new Schema<IGroup>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 64,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 256,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export const GroupModel = model<IGroup>('Group', GroupSchema);


