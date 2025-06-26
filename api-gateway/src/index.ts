import express, { NextFunction, Request, Response } from "express";
import { ClientRequest, IncomingMessage, ServerResponse } from "http";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { Socket } from "net";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

const app = express();
const PORT = process.env.PORT || 4000;

const SERVICE_USER_URL = process.env.SERVICE_USER_URL || "http://service-user:7000";
const SERVICE_ROOM_URL = process.env.SERVICE_ROOM_URL || "http://service-room:7001";
const SERVICE_TEAM_URL = process.env.SERVICE_TEAM_URL || "http://service-team:7002";

const onProxyReq = (proxyReq: ClientRequest, req: IncomingMessage, res: ServerResponse) => {
  console.log(`[PROXY] -> Forwarding request: ${req.method} ${req.url} to ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
};

const onError = (err: Error, req: IncomingMessage, res: ServerResponse | Socket) => {
  console.error('[PROXY] Error:', err);
  if (res instanceof ServerResponse) {
    if (!res.headersSent) {
      res.writeHead(504, { 'Content-Type': 'text/plain' });
      res.end('Proxy encountered an error. Check gateway logs for details.');
    }
  } else {
    res.destroy();
  }
};

const onProxyRes = (proxyRes: IncomingMessage, req: IncomingMessage, res: ServerResponse) => {
  console.log(`[PROXY] <- Received response from target: ${proxyRes.statusCode} ${proxyRes.statusMessage}`);
};

const onClose = (req: IncomingMessage, socket: Socket, head: Buffer) => {
  console.log('[PROXY] Client connection closed.');
};

const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
};
app.use(
  '/documentation',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerUiOptions)
);

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[GATEWAY] -> Received request: ${req.method} ${req.originalUrl}`);
  next();
});

const proxyOptions = (target: string): Options => ({
  target,
  changeOrigin: true,
  on: {
    proxyReq: onProxyReq,
    error: onError,
    proxyRes: onProxyRes,
    close: onClose,
  },
});

app.use("/api/users", createProxyMiddleware({
  ...proxyOptions(SERVICE_USER_URL),
  pathRewrite: { '^/api/users': '/' },
}));

app.use("/api/rooms", createProxyMiddleware({
  ...proxyOptions(SERVICE_ROOM_URL),
  pathRewrite: { '^/api/rooms': '/' },
}));

app.use("/api/teams", createProxyMiddleware({
  ...proxyOptions(SERVICE_TEAM_URL),
  pathRewrite: { '^/api/teams': '/' },
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
