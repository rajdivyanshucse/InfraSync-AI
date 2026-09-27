import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  apiPrefix: process.env.API_PREFIX || '/api',
  dataSource: (process.env.DATA_SOURCE || 'mock').toLowerCase(), // 'mock' or 'mongodb'
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/infra_sync_ai',
  mongodbDbName: process.env.MONGODB_DB_NAME || 'infra_sync_ai',
  storageProvider: (process.env.STORAGE_PROVIDER || 'local').toLowerCase(),
  storageRoot: process.env.STORAGE_ROOT || './storage/uploads',
  maxFileSizeBytes: parseInt(process.env.MAX_FILE_SIZE_BYTES || '52428800', 10), // 50MB default
};

export const validateConfig = () => {
  const errors = [];
  const warnings = [];

  if (isNaN(config.port) || config.port < 1 || config.port > 65535) {
    errors.push(`Invalid PORT configuration: "${process.env.PORT}". Must be an integer between 1 and 65535.`);
  }

  if (!['mock', 'mongodb'].includes(config.dataSource)) {
    errors.push(`Invalid DATA_SOURCE: "${config.dataSource}". Must be 'mock' or 'mongodb'.`);
  }

  if (config.nodeEnv === 'production') {
    if (config.dataSource === 'mock') {
      warnings.push('[Config Warning] Server is running in production mode with DATA_SOURCE=mock. Persistent MongoDB is recommended for live multi-tenant production.');
    }
    if (config.corsOrigin === '*') {
      warnings.push('[Config Warning] CORS_ORIGIN is set to wildcard "*" in production. A specific origin list is strongly recommended.');
    }
  }

  if (errors.length > 0) {
    throw new Error(`[Config Error] Startup configuration validation failed:\n- ${errors.join('\n- ')}`);
  }

  warnings.forEach((w) => console.warn(w));
};
