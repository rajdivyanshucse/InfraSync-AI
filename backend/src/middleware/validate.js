import { errorResponse } from '../utils/apiResponse.js';

/**
 * Lightweight parameter validator
 */
export const validateParams = (requiredParams = []) => {
  return (req, res, next) => {
    for (const param of requiredParams) {
      const val = req.params[param];
      if (!val || typeof val !== 'string' || val.trim().length === 0) {
        return errorResponse(
          res,
          `Missing or invalid route parameter: ${param}`,
          'INVALID_PARAMETER',
          400
        );
      }
    }
    next();
  };
};
