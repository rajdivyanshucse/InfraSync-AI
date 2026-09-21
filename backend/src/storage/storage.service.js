import crypto from 'crypto';
import path from 'path';
import { config } from '../config/env.js';
import { LocalStorageProvider } from './localStorage.provider.js';
import { isMimeTypeAllowed, getExtensionForMimeType } from './storage.types.js';

export class StorageService {
  constructor(provider = null) {
    this.provider = provider || new LocalStorageProvider(config.storageRoot);
  }

  /**
   * Computes SHA-256 checksum from buffer
   */
  calculateChecksum(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Generates safe server-side storage filename: <uuid><extension>
   */
  generateStorageKey(originalName, mimeType) {
    const ext = getExtensionForMimeType(mimeType) || path.extname(originalName).toLowerCase() || '.bin';
    const cleanExt = ext.startsWith('.') ? ext : `.${ext}`;
    const uuid = crypto.randomUUID();
    return `${uuid}${cleanExt}`;
  }

  /**
   * Saves uploaded evidence file
   */
  async saveEvidenceFile(file) {
    if (!file || !file.buffer) {
      throw new Error('Invalid file payload: missing file buffer');
    }

    const { originalname, mimetype, buffer, size } = file;

    if (!isMimeTypeAllowed(mimetype)) {
      const error = new Error(`Unsupported file type: ${mimetype}`);
      error.statusCode = 400;
      error.code = 'UNSUPPORTED_FILE_TYPE';
      throw error;
    }

    if (size > config.maxFileSizeBytes) {
      const error = new Error(`File size exceeds limit of ${Math.round(config.maxFileSizeBytes / 1048576)}MB`);
      error.statusCode = 400;
      error.code = 'FILE_TOO_LARGE';
      throw error;
    }

    const key = this.generateStorageKey(originalname, mimetype);
    const checksum = this.calculateChecksum(buffer);

    await this.provider.save(buffer, key);

    return {
      provider: config.storageProvider,
      key,
      originalName: originalname,
      storedName: key,
      mimeType: mimetype,
      sizeBytes: size || buffer.length,
      checksum,
      uploadedAt: new Date().toISOString(),
    };
  }

  /**
   * Retrieves read stream for stored evidence
   */
  async getEvidenceStream(key) {
    const exists = await this.provider.exists(key);
    if (!exists) {
      return null;
    }
    return this.provider.getStream(key);
  }

  /**
   * Deletes a stored evidence file (used during rollback / cleanup)
   */
  async deleteEvidenceFile(key) {
    if (!key) return false;
    return await this.provider.delete(key);
  }
}

export const storageService = new StorageService();
