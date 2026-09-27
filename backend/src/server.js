import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { config, validateConfig } from './config/env.js';
import { corsOptions } from './config/cors.js';
import { connectDatabase, disconnectDatabase, getDatabaseStatus } from './config/database.js';
import { correlationMiddleware } from './middleware/correlation.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { securityHeaders } from './middleware/securityHeaders.js';
import { sanitizeInputs } from './middleware/validate.js';
import { authenticate } from './middleware/auth.js';
import { generalRateLimiter } from './middleware/rateLimiter.js';
import apiRouter from './routes/index.js';

const app = express();

// 1. Correlation & Security Headers
app.use(correlationMiddleware);
app.use(securityHeaders);

// 2. CORS & Global Rate Limiting
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

// 5. Root Liveness & Readiness Endpoints (Orchestrator Friendly)
app.get('/health', (req, res) => {
  res.json({
    service: 'infrasync-api',
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
    environment: config.nodeEnv,
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/ready', (req, res) => {
  const dbStatus = getDatabaseStatus();
  const isDbReady = config.dataSource === 'mock' || dbStatus.status === 'connected';
  const data = {
    service: 'infrasync-api',
    status: isDbReady ? 'ready' : 'not_ready',
    environment: config.nodeEnv,
    dataSource: config.dataSource,
    database: dbStatus,
    ready: isDbReady,
    timestamp: new Date().toISOString(),
  };

  if (!isDbReady) {
    return res.status(503).json({ success: false, error: { code: 'SERVICE_NOT_READY', message: 'Database not connected', details: data } });
  }
  res.json({ success: true, data });
});

// Base Information Route
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
const isDirectEntry = process.argv[1] && (
  process.argv[1].endsWith('server.js') || 
  fileURLToPath(import.meta.url) === process.argv[1]
);

let server = null;

if (isDirectEntry && process.env.NODE_ENV !== 'test') {
  try {
    validateConfig();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  // Connect to Database if DATA_SOURCE is mongodb
  if (config.dataSource === 'mongodb') {
    connectDatabase().catch((err) => {
      console.warn('[Database] Initial connection attempt failed:', err.message);
    });
  }

  server = app.listen(config.port, () => {
    console.log(`=========================================`);
    console.log(`🚀 InfraSync AI API Server Running`);
    console.log(`📡 Port:        ${config.port}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
    console.log(`💾 Data Source: ${config.dataSource}`);
    console.log(`🔗 Health URL:  http://localhost:${config.port}${config.apiPrefix}/health`);
    console.log(`🔒 CORS Origin: ${config.corsOrigin}`);
    console.log(`=========================================`);
  });

  // Graceful Shutdown Handler
  const handleShutdown = async (signal) => {
    console.log(`\n[Shutdown] Received ${signal}. Starting graceful shutdown...`);
    if (server) {
      server.close(async () => {
        console.log('[Shutdown] HTTP server closed.');
        try {
          await disconnectDatabase();
        } catch (err) {
          console.error('[Shutdown] Error disconnecting database:', err);
        }
        process.exit(0);
      });

      // Force process termination if graceful shutdown times out
      setTimeout(() => {
        console.error('[Shutdown] Forceful shutdown after 10s timeout.');
        process.exit(1);
      }, 10000).unref();
    } else {
      process.exit(0);
    }
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

export default app;
