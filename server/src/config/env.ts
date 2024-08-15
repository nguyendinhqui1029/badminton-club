import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface EnvConfig {
  PORT: number;
  MONGODB_URI: string;
  MONGOOSE_PASS: string;
  MONGOOSE_USER: string;
  DB_NAME: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  SALT_ROUNDS: number;
}
const env: EnvConfig = {
  PORT: parseInt(process.env.PORT as string, 10) || 3000,
  MONGODB_URI: process.env.MONGODB_URI as string,
  MONGOOSE_PASS: process.env.MONGOOSE_PASS as string,
  MONGOOSE_USER: process.env.MONGOOSE_USER as string,
  DB_NAME: process.env.DB_NAME as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS as string, 10)
};

export default env;