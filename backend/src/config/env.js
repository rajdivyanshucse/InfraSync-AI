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
