// service-room/src/index.ts
import express from 'express';
import { connectToDatabase, sequelize } from './config/database';
import roomRoutes from './routes/roomRoutes';

const app = express();
const PORT = process.env.PORT || 7001; // Port 7001 pour le service room

app.use(express.json());

// Middleware de log simple
app.use((req, res, next) => {
  console.log(`[Service Room] ${req.method} ${req.path}`);
  next();
});

// Monte les routes des salles
// Les requêtes arriveront ici après que l'API Gateway ait réécrit '/api/rooms' en '/'
app.use('/', roomRoutes);

// Route de santé pour Docker healthcheck
app.get('/health', async (_req, res) => {
    try {
        await sequelize.authenticate();
        res.status(200).send('Service Room is healthy and DB is connected');
    } catch (error) {
        console.error('Healthcheck failed: DB connection error', error);
        res.status(500).send('Service Room is unhealthy: DB connection failed');
    }
});

async function startServer() {
    await connectToDatabase();
    // Synchronise les modèles avec la base de données.
    // Utilise `alter: true` en dev pour mettre à jour les tables sans les recréer entièrement.
    await sequelize.sync({ alter: true });
    console.log('Database synchronized.');

    app.listen(PORT, () => {
        console.log(`Service Room running on port ${PORT}`);
    });
}

startServer();