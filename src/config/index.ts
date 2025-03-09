import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: parseInt(process.env.PORT as string)|| 3000,
  DATABASE_URL: process.env.DATABASE_URL || '',
  DUMMY_DATA_URL: process.env.DUMMY_DATA_URL || ''
};