import morgan from 'morgan';
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './routes';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app: Express = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('/ of API of service-team');
})

// Error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
