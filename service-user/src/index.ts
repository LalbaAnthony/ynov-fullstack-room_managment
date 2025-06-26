import express from "express";
import { connectToDatabase, sequelize } from "./config/database";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[Service User] ${req.method} ${req.path}`);
  next();
});

app.use("/auth", authRoutes);

app.use("/", userRoutes);

app.get("/health", async (_req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).send("Service User is healthy and DB is connected");
  } catch (error) {
    console.error("Healthcheck failed: DB connection error", error);
    res.status(500).send("Service User is unhealthy: DB connection failed");
  }
});

async function startServer() {
  await connectToDatabase();
  await sequelize.sync({ alter: true });
  console.log("Database synchronized.");

  app.listen(PORT, () => {
    console.log(`Service User running on port ${PORT}`);
  });
}

startServer();
