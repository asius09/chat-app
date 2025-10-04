import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  isOnline: boolean;
  lastSeen?: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 128,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (err) {
    next(err as Error);
  }
});

async function hashPasswordInUpdate(this: any, next: (err?: Error) => void) {
  const update = this.getUpdate();
  if (!update) return next();

  // Handle both direct set and $set
  let passwordToHash: string | undefined;
  if (update.password) {
    passwordToHash = update.password;
  } else if (update.$set && update.$set.password) {
    passwordToHash = update.$set.password;
  }

  if (passwordToHash) {
    try {
      const saltRounds = 10;
      const hashed = await bcrypt.hash(passwordToHash, saltRounds);
      if (update.password) {
        update.password = hashed;
      } else if (update.$set && update.$set.password) {
        update.$set.password = hashed;
      }
      this.setUpdate(update);
    } catch (err) {
      return next(err as Error);
    }
  }
  next();
}

UserSchema.pre('findOneAndUpdate', hashPasswordInUpdate);
UserSchema.pre('updateOne', hashPasswordInUpdate);

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
