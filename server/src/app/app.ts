import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import env from '../config/env';
import { ROUTER_PATH } from '../constants/common.constants';
import userRoutes from '../routes/userRoutes';

 class App {
  public app: Application;
  public port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.config();
    this.routes();
    this.connectToDatabase();
  }

  private config(): void {
    this.app.use(express.static('public'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
  }

  private routes(): void {
    const root = `${ROUTER_PATH.ROOT}/${ROUTER_PATH.VERSION}`;
    this.app.use(`${root}/${ROUTER_PATH.USER}`, userRoutes);
    // Add more routes as needed
  }

  private async connectToDatabase(): Promise<void> {
    try {
      await mongoose.connect(env.MONGODB_URI.replace('<username>', env.MONGOOSE_USER).replace('<password>', env.MONGOOSE_PASS), {
        bufferCommands: true,
        dbName: env.DB_NAME.toString(),
        user:  env.MONGOOSE_USER.toString(),
        pass: env.MONGOOSE_PASS.toString(),
        autoIndex: true,
        autoCreate: true
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }
}
export default App;