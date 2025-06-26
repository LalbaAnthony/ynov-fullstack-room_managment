import express from "express";
import { connectToDatabase, sequelize } from "./config/database";
import teamRoutes from "./routes/teamRoutes";

const app = express();
const PORT = process.env.PORT || 7002;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[Service Team] ${req.method} ${req.path}`);
  next();
});

app.use("/", teamRoutes);

app.get("/health", async (_req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).send("Service Team is healthy and DB is connected");
  } catch (error) {
    console.error("Healthcheck failed: DB connection error", error);
    res.status(500).send("Service Team is unhealthy: DB connection failed");
  }
});

async function startServer() {
  await connectToDatabase();
  await sequelize.sync({ alter: true });
  console.log("Database synchronized.");

  app.listen(PORT, () => {
    console.log(`Service Team running on port ${PORT}`);
  });
}

startServer();
