import bcrypt from "bcryptjs";
import express from "express";
import { connectToDatabase, sequelize } from "./config/database";
import User from "./models/user";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import { UserCreationAttributes } from "./types";

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

/**
 * Fonction pour créer des utilisateurs de base dans la DB s'ils n'existent pas.
 */
async function seedDatabase() {
  console.log("[SEED] Checking for initial users...");

  const usersToSeed: (Pick<UserCreationAttributes, 'firstName' | 'lastName' | 'email' | 'role' | 'isFirstConnection'> & { password: string })[] = [
    {
      firstName: 'admin',
      lastName: 'admin',
      email: 'admin@admin.com',
      password: 'admin123',
      role: 'admin',
      isFirstConnection: false
    },
    {
      firstName: 'yoan',
      lastName: 'martins',
      email: 'yoan@yoan.com',
      password: 'azertyuiop',
      role: 'student',
      isFirstConnection: false
    },
    {
      firstName: 'anthony',
      lastName: 'lalba',
      email: 'anthony@anthony.com',
      password: 'azertyuiop',
      role: 'student',
      isFirstConnection: false
    }
  ];

  for (const userData of usersToSeed) {
    try {
      const existingUser = await User.findOne({ where: { email: userData.email } });

      if (!existingUser) {
        const passwordHash = await bcrypt.hash(userData.password, 10);

        await User.create({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          passwordHash: passwordHash,
          role: userData.role,
          isFirstConnection: userData.isFirstConnection,
        });
        console.log(`[SEED] User ${userData.email} created successfully.`);
      } else {
        console.log(`[SEED] User ${userData.email} already exists. Skipping.`);
      }
    } catch (error) {
      console.error(`[SEED] Error creating user ${userData.email}:`, error);
    }
  }
  console.log("[SEED] Database seeding process finished.");
}

async function startServer() {
  await connectToDatabase();
  await sequelize.sync({ alter: true });
  console.log("Database synchronized.");

  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`Service User running on port ${PORT}`);
  });
}

startServer();
