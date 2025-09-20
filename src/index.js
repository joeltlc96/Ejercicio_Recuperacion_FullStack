import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from './config/config.js';
import { logger } from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/tasks.routes.js';

const app = express();

app.use(cors({
  origin: config.origin,    
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(logger);            

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`API corriendo en http://localhost:${config.port}`);
});
