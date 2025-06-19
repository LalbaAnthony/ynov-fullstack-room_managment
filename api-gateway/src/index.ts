import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware de sécurité
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limite chaque IP à 100 requêtes par windowMs
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
});
app.use(limiter);

// Logging
app.use(morgan('combined'));

// Middleware pour parser JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes de santé
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'api-gateway',
        version: '1.0.0'
    });
});

// Configuration des proxies vers les microservices
const services = {
    user: process.env.USER_SERVICE_URL || 'http://service-user:7000',
    room: process.env.ROOM_SERVICE_URL || 'http://service-room:7001',
    team: process.env.TEAM_SERVICE_URL || 'http://service-team:7002',
};

// Proxy vers service-user
app.use('/api/users', createProxyMiddleware({
    target: services.user,
    changeOrigin: true,
}));

// Proxy vers service-room
app.use('/api/rooms', createProxyMiddleware({
    target: services.room,
    changeOrigin: true,
}));

// Proxy vers service-team
app.use('/api/teams', createProxyMiddleware({
    target: services.team,
    changeOrigin: true,
}));

// Route par défaut
app.get('/', (req, res) => {
    res.json({
        message: 'API Gateway - Microservices Architecture',
        version: '1.0.0',
        services: {
            user: `${services.user}`,
            room: `${services.room}`,
            team: `${services.team}`,
        },
        endpoints: {
            health: '/health',
            users: '/api/users',
            rooms: '/api/rooms',
            teams: '/api/teams',
        },
    });
});

// Middleware de gestion des erreurs
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Erreur interne du serveur',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue',
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 API Gateway démarré sur le port ${PORT}`);
    console.log(`📍 Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Services configurés:`);
    console.log(`   - User Service: ${services.user}`);
    console.log(`   - Room Service: ${services.room}`);
    console.log(`   - Team Service: ${services.team}`);
});

// Gestion propre de l'arrêt
process.on('SIGTERM', () => {
    console.log('🛑 Arrêt du serveur API Gateway...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Arrêt du serveur API Gateway...');
    process.exit(0);
});