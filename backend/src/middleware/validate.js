import { errorResponse } from '../utils/apiResponse.js';

/**
 * Checks for MongoDB injection keys (starting with $) or Prototype Pollution keys (__proto__, constructor)
 */
const containsDangerousKeys = (obj) => {
  if (!obj || typeof obj !== 'object') return false;

  const keys = Object.getOwnPropertyNames(obj);
  for (const key of keys) {
    if (key.startsWith('$') || key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return true;
    }
    try {
      if (typeof obj[key] === 'object' && obj[key] !== null && containsDangerousKeys(obj[key])) {
        return true;
      }
    } catch {
      return true;
    }
  }
  return false;
};

/**
 * Sanitizes request query, body, and params against MongoDB operator injection and prototype pollution
 */
export const sanitizeInputs = (req, res, next) => {
  if (containsDangerousKeys(req.query) || containsDangerousKeys(req.body) || containsDangerousKeys(req.params)) {
    return errorResponse(
      res,
      'Malformed request: Dangerous operators or invalid keys detected.',
      'INVALID_QUERY_OPERATOR',
      400
    );
  }
  next();
};

/**
 * Validates required URL parameters and enforces safe format
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

      // Ensure ID parameters only contain safe alphanumeric, dash, underscore characters
      if (param.toLowerCase().endsWith('id') && !/^[A-Za-z0-9_-]+$/.test(val)) {
        return errorResponse(
          res,
          `Invalid format for identifier parameter '${param}': ${val}`,
          'VALIDATION_ERROR',
          400
        );
      }
    }
    next();
  };
};

/**
 * Validates enum fields in query or body
 */
export const validateEnum = (location, field, allowedValues) => {
  return (req, res, next) => {
    const target = location === 'query' ? req.query : req.body;
    const value = target[field];

    if (value !== undefined && value !== null && value !== '') {
      if (!allowedValues.includes(value)) {
        return errorResponse(
          res,
          `Invalid value '${value}' for field '${field}'. Allowed values: ${allowedValues.join(', ')}`,
          'INVALID_ENUM_VALUE',
          400
        );
      }
    }
    next();
  };
};

/**
 * Validates and clamps pagination query parameters
 */
export const validatePagination = (req, _res, next) => {
  let limit = parseInt(req.query.limit, 10);
  let page = parseInt(req.query.page, 10);

  if (isNaN(limit) || limit < 1) limit = 50;
  if (limit > 100) limit = 100; // Cap at max 100

  if (isNaN(page) || page < 1) page = 1;

  req.pagination = { limit, page, skip: (page - 1) * limit };
  next();
};
