import express from "express";
import { connectToDatabase, sequelize } from "./config/database";
import roomRoutes from "./routes/roomRoutes";

const app = express();
const PORT = process.env.PORT || 7001;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[Service Room] ${req.method} ${req.path}`);
  next();
});

app.use("/", roomRoutes);

app.get("/health", async (_req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).send("Service Room is healthy and DB is connected");
  } catch (error) {
    console.error("Healthcheck failed: DB connection error", error);
    res.status(500).send("Service Room is unhealthy: DB connection failed");
  }
});

async function startServer() {
  await connectToDatabase();
  await sequelize.sync({ alter: true });
  console.log("Database synchronized.");

  app.listen(PORT, () => {
    console.log(`Service Room running on port ${PORT}`);
  });
}

startServer();
