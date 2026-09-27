/**
 * Structured request logging middleware for InfraSync AI REST API
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl } = req;
  const requestId = req.id || req.headers['x-request-id'] || 'no-id';

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const timestamp = new Date().toISOString();
    const logMessage = `[API] [${timestamp}] [${requestId}] ${method} ${originalUrl} ${statusCode} - ${duration}ms`;
    if (statusCode >= 500) {
      console.error(logMessage);
    } else if (statusCode >= 400) {
      console.warn(logMessage);
    } else {
      console.log(logMessage);
    }
  });

  next();
};
