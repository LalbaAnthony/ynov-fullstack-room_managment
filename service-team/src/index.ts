import morgan from 'morgan';
import dotenv from 'dotenv';
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// Logging requests
app.use(morgan('combined'));

// CORS
app.use(cors());

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('/ of API of service-team');
})

app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Service TEAM is running at http://localhost:${port}`);
});