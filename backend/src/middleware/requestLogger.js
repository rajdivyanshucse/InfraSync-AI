/**
 * Request logging middleware for InfraSync AI REST API
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const logMessage = `[API] ${method} ${originalUrl} ${statusCode} - ${duration}ms`;
    if (statusCode >= 400) {
      console.warn(logMessage);
    } else {
      console.log(logMessage);
    }
  });

  next();
};
