import dotenv from 'dotenv';
dotenv.config();

export const aiConfig = {
  serviceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  timeoutMs: parseInt(process.env.AI_SERVICE_TIMEOUT_MS || '10000', 10),
};
