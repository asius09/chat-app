import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

export const config = {
  PORT: process.env.PORT,
  MONGO_URI: isProduction
    ? process.env.MONGO_URI!
    : 'mongodb://localhost:27017/chat-app',
};
