import mongoose from 'mongoose';
import { config } from '../../config';

const MONGO_URI = config.MONGO_URI;

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Optionally, exit the process if connection fails
    process.exit(1);
  }
}
