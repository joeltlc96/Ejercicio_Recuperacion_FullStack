import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from './config/config.js';
import { logger } from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/tasks.routes.js';

const app = express();

// Middlewares base
app.use(cors({
  origin: config.origin,    // sólo necesario si habrá front con cookies
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(logger);            // loguea todas las peticiones

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Healthcheck
app.get('/health', (req, res) => res.json({ ok: true }));

// Errores
app.use(errorHandler);

// Arranque
app.listen(config.port, () => {
  console.log(`API corriendo en http://localhost:${config.port}`);
});
