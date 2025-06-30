import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { ClientRequest, IncomingMessage, ServerResponse } from "http";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { Socket } from "net";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";

const app = express();
const PORT = process.env.PORT || 4000;

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(
    `[GATEWAY] -> Received request: ${req.method} ${req.originalUrl}`
  );
  next();
});

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());

const SERVICE_USER_URL =
  process.env.SERVICE_USER_URL || "http://service-user:7000";
const SERVICE_ROOM_URL =
  process.env.SERVICE_ROOM_URL || "http://service-room:7001";
const SERVICE_TEAM_URL =
  process.env.SERVICE_TEAM_URL || "http://service-team:7002";

const onProxyReq = (
  proxyReq: ClientRequest,
  req: IncomingMessage,
  res: ServerResponse
) => {
  const expressReq = req as Request;
  console.log(
    `[PROXY] -> Forwarding request: ${expressReq.method} ${expressReq.url} to ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`
  );

  if (expressReq.body) {
    const bodyData = JSON.stringify(expressReq.body);
    proxyReq.setHeader("Content-Type", "application/json");
    proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  }
};

const onError = (
  err: Error,
  req: IncomingMessage,
  res: ServerResponse | Socket
) => {
  console.error("[PROXY] Error:", err);
  if (res instanceof ServerResponse && !res.headersSent) {
    res.writeHead(504, { "Content-Type": "text/plain" });
    res.end("Proxy encountered an error.");
  } else if (res instanceof Socket) {
    res.destroy();
  }
};

const proxyOptions = (target: string): Options => ({
  target,
  changeOrigin: true,
  on: {
    proxyReq: onProxyReq,
    error: onError,
  },
});

app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/user", createProxyMiddleware(proxyOptions(SERVICE_USER_URL)));
app.use("/api/rooms", createProxyMiddleware(proxyOptions(SERVICE_ROOM_URL)));
app.use("/api/teams", createProxyMiddleware(proxyOptions(SERVICE_TEAM_URL)));

app.get("/", (_req: Request, res: Response) => {
  res.send("API Gateway is running!");
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("API Gateway is healthy");
});

app.listen(PORT, () => {
  console.log(`API Gateway started on port ${PORT}`);
});
