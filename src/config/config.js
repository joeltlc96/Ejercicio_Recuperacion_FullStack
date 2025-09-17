import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '9000', 10),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  cookieSecure: (process.env.COOKIE_SECURE || 'false').toLowerCase() === 'true',
  origin: process.env.ORIGIN || 'http://localhost:3000',
};
