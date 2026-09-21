/**
 * InfraSync AI — Standard API Response Helpers
 */

export const successResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

export const errorResponse = (res, message, code = 'INTERNAL_ERROR', statusCode = 500, details = null) => {
  const errorObj = {
    code,
    message,
  };

  if (details && process.env.NODE_ENV !== 'production') {
    errorObj.details = details;
  }

  return res.status(statusCode).json({
    success: false,
    error: errorObj,
  });
};
