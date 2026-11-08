import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authRouter from './routes/auth.js';
import resourceRouter from './routes/resources.js';
import { errorHandler, notFound } from './middleware/errors.js';
import { originGuard } from './security.js';
import { createEmailSender } from './email.js';

export function createApp(config, dependencies = {}) {
  const app = express();
  app.locals.emailSender = dependencies.emailSender || createEmailSender(config.email);
  app.disable('x-powered-by');
  if (config.NODE_ENV === 'production') app.set('trust proxy', 1);

  app.use(helmet());
  app.use(cors({
    origin(origin, callback) {
      if (!origin || config.allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    maxAge: 600,
  }));
  app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    return next();
  });
  app.use(express.json({ limit: '32kb', strict: true }));
  app.use(cookieParser());
  app.use('/api', originGuard(config.allowedOrigins));
  app.use('/api', rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler(req, res) {
      res.status(429).json({ error: { code: 'RATE_LIMITED', message: 'Too many requests. Try again later.' } });
    },
  }));

  app.get('/health', (req, res) => {
    res.json({ data: { status: 'ok' } });
  });
  app.use('/api/auth', authRouter);
  app.use('/api', resourceRouter);

  if (config.NODE_ENV === 'production') {
    const frontendDist = fileURLToPath(new URL('../../frontend/dist', import.meta.url));
    app.use(express.static(frontendDist));
    app.get('*', (req, res, next) => {
      if (req.path === '/api' || req.path.startsWith('/api/')) return next();
      return res.sendFile(path.join(frontendDist, 'index.html'), error => {
        if (error) next(error);
      });
    });
  }

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
