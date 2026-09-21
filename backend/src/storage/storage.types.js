/**
 * InfraSync AI — Evidence Storage Types & Allowed Formats
 */

export const ALLOWED_MIME_TYPES = {
  // Images
  'image/jpeg': { ext: '.jpg', category: 'PHOTO' },
  'image/png': { ext: '.png', category: 'PHOTO' },
  'image/webp': { ext: '.webp', category: 'PHOTO' },

  // Video
  'video/mp4': { ext: '.mp4', category: 'VIDEO' },
  'video/webm': { ext: '.webm', category: 'VIDEO' },

  // Documents
  'application/pdf': { ext: '.pdf', category: 'DOCUMENT' },
};

export const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.mp4', '.webm', '.pdf']);

export const isMimeTypeAllowed = (mimeType) => {
  if (!mimeType) return false;
  return Object.prototype.hasOwnProperty.call(ALLOWED_MIME_TYPES, mimeType.toLowerCase());
};

export const getCategoryForMimeType = (mimeType) => {
  const info = ALLOWED_MIME_TYPES[mimeType?.toLowerCase()];
  return info ? info.category : 'DOCUMENT';
};

export const getExtensionForMimeType = (mimeType) => {
  const info = ALLOWED_MIME_TYPES[mimeType?.toLowerCase()];
  return info ? info.ext : '';
};
