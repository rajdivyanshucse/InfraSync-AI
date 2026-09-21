import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { corsOptions } from './config/cors.js';
import { connectDatabase } from './config/database.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { securityHeaders } from './middleware/securityHeaders.js';
import { sanitizeInputs } from './middleware/validate.js';
import { authenticate } from './middleware/auth.js';
import { generalRateLimiter } from './middleware/rateLimiter.js';
import apiRouter from './routes/index.js';

const app = express();

// 1. Security Headers
app.use(securityHeaders);

// 2. CORS & Rate Limiting
app.use(cors(corsOptions));
app.use(generalRateLimiter.middleware());

// 3. Body Parsing & Sanitization
app.use(
  express.json({
    limit: '10mb',
    reviver: (key, value) => {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        const err = new Error('Dangerous prototype property detected in request body');
        err.status = 400;
        err.code = 'INVALID_QUERY_OPERATOR';
        throw err;
      }
      return value;
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeInputs);

// 4. Request Logging & Authentication Context
app.use(requestLogger);
app.use(authenticate);


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
