import mongoose from 'mongoose';
import { config } from './env.js';

let isConnected = false;

/**
 * Connect to MongoDB database
 */
export const connectDatabase = async () => {
  if (config.dataSource !== 'mongodb') {
    return false;
  }

  if (isConnected) {
    return true;
  }

  try {
    const opts = {
      dbName: config.mongodbDbName,
      serverSelectionTimeoutMS: 3000,
    };

    await mongoose.connect(config.mongodbUri, opts);
    isConnected = true;
    console.log(`[Database] Connected to MongoDB (${config.mongodbDbName})`);
    return true;
  } catch (err) {
    isConnected = false;
    console.warn(`[Database] MongoDB connection failed: ${err.message}. Operating in fallback mode.`);
    return false;
  }
};

/**
 * Disconnect from MongoDB database
 */
export const disconnectDatabase = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('[Database] Disconnected from MongoDB');
  }
};

/**
 * Safe database status reporting (No credentials or secrets exposed)
 */
export const getDatabaseStatus = () => {
  if (config.dataSource !== 'mongodb') {
    return {
      provider: 'mock',
      status: 'mock',
    };
  }

  const state = mongoose.connection.readyState;
  let statusText = 'disconnected';
  if (state === 1) statusText = 'connected';
  else if (state === 2) statusText = 'connecting';
  else if (state === 3) statusText = 'disconnecting';

  return {
    provider: 'mongodb',
    status: statusText,
  };
};
