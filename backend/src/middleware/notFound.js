import { errorResponse } from '../utils/apiResponse.js';

/**
 * 404 Route Not Found Middleware
 */
export const notFound = (req, res) => {
  return errorResponse(
    res,
    `Endpoint not found: ${req.method} ${req.originalUrl}`,
    'RESOURCE_NOT_FOUND',
    404
  );
};
