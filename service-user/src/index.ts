import app from './app';
import sequelize from './config/database';

const PORT = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');

    await sequelize.sync({ force: false });
    console.log('Database synchronized');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();