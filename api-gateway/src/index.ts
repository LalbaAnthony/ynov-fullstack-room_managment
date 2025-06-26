import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

const app = express();
const PORT = process.env.PORT || 4000;

const SERVICE_USER_URL = process.env.SERVICE_USER_URL || "http://localhost:7000";
const SERVICE_ROOM_URL = process.env.SERVICE_ROOM_URL || "http://localhost:7001";
const SERVICE_TEAM_URL = process.env.SERVICE_TEAM_URL || "http://localhost:7002";

const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
};
app.use(
  '/documentation',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerUiOptions)
);

app.use(express.json());

app.use((req: express.Request, _res: express.Response, next: express.NextFunction) => {
  if (req.path.startsWith('/api-docs')) {
    return next();
  }
  console.log(`[API Gateway] ${req.method} ${req.path}`);
  next();
});

app.use("/api/users", createProxyMiddleware({
  target: SERVICE_USER_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': '/',
  },
}));

app.use("/api/rooms", createProxyMiddleware({
  target: SERVICE_ROOM_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/rooms': '/',
  },
}));

app.use("/api/teams", createProxyMiddleware({
  target: SERVICE_TEAM_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/teams': '/',
  },
}));

app.get("/", (_req, res) => {
  res.send("API Gateway is running!");
});

app.get("/health", (_req, res) => {
  res.status(200).send("API Gateway is healthy");
});

app.listen(PORT, () => {
  console.log(`API Gateway started on port ${PORT}`);
  console.log(`User Service URL: ${SERVICE_USER_URL}`);
  console.log(`Room Service URL: ${SERVICE_ROOM_URL}`);
  console.log(`Team Service URL: ${SERVICE_TEAM_URL}`);
});