import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { corsOptions } from './config/cors.js';
import { connectDatabase } from './config/database.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import apiRouter from './routes/index.js';

const app = express();

// Security Baseline Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);

// Base Route
app.get('/', (req, res) => {
  res.json({
    name: 'InfraSync AI REST API & Persistence Layer',
    status: 'online',
    version: '1.0.0',
    dataSource: config.dataSource,
    documentation: `${config.apiPrefix}/health`,
  });
});

// Mount API Router under prefix (e.g. /api)
app.use(config.apiPrefix, apiRouter);

// 404 & Centralized Error Handlers
app.use(notFound);
app.use(errorHandler);

// Start Server if directly executed
if (process.env.NODE_ENV !== 'test') {
  // Connect to Database if DATA_SOURCE is mongodb
  if (config.dataSource === 'mongodb') {
    connectDatabase().catch((err) => {
      console.warn('[Database] Initial connection attempt failed:', err.message);
    });
  }

  app.listen(config.port, () => {
    console.log(`=========================================`);
    console.log(`🚀 InfraSync AI API Server Running`);
    console.log(`📡 Port:        ${config.port}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
    console.log(`💾 Data Source: ${config.dataSource}`);
    console.log(`🔗 Health URL:  http://localhost:${config.port}${config.apiPrefix}/health`);
    console.log(`🔒 CORS Origin: ${config.corsOrigin}`);
    console.log(`=========================================`);
  });
}

export default app;
