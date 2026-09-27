import crypto from 'crypto';

/**
 * Request correlation middleware for end-to-end operational traceability
 */
export const correlationMiddleware = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || `req-${crypto.randomBytes(8).toString('hex')}`;
  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
};
