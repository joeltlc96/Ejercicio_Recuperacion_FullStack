import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'No autenticado' });

    const decoded = jwt.verify(token, config.jwtSecret);
    req.userId = decoded.sub;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido' });
  }
}
