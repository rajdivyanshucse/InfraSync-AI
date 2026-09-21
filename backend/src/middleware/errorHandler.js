import { errorResponse } from '../utils/apiResponse.js';

/**
 * Centralized Error Handling Middleware
 */
export const errorHandler = (err, req, res, _next) => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected internal error occurred.';

  return errorResponse(res, message, errorCode, statusCode, err.stack);
};
