import multer from 'multer';
import { config } from '../config/env.js';
import { isMimeTypeAllowed } from '../storage/storage.types.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (isMimeTypeAllowed(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(`Unsupported file type: ${file.mimetype}`);
    error.code = 'UNSUPPORTED_FILE_TYPE';
    error.statusCode = 400;
    cb(error, false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: config.maxFileSizeBytes,
  },
  fileFilter,
});

export const handleSingleUpload = (fieldName = 'file') => {
  const uploadSingle = upload.single(fieldName);

  return (req, res, next) => {
    uploadSingle(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          const error = new Error(`File exceeds maximum size limit of ${Math.round(config.maxFileSizeBytes / 1048576)}MB`);
          error.code = 'FILE_TOO_LARGE';
          error.statusCode = 400;
          return next(error);
        }
        err.statusCode = 400;
        return next(err);
      }
      if (err) {
        return next(err);
      }
      next();
    });
  };
};
