import morgan from 'morgan';
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './routes';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app: Express = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware pour servir la documentation Swagger
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'API Documentation', version: '1.0.0', description: 'Documentation de l\'API', },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
  },
  apis: ['./routes/*.ts'],
})));

// Routes
app.use(routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('/ of API of service-room');
})

// Error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
