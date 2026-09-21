import fs from 'fs';
import path from 'path';

/**
 * Local Filesystem Storage Provider
 * Implements provider abstraction for storing evidence assets locally.
 */
export class LocalStorageProvider {
  constructor(storageRoot = './storage/uploads') {
    this.storageRoot = path.resolve(storageRoot);
    this._ensureDirectory();
  }

  _ensureDirectory() {
    if (!fs.existsSync(this.storageRoot)) {
      fs.mkdirSync(this.storageRoot, { recursive: true });
    }
  }

  /**
   * Resolves and verifies safe absolute path (Prevents Path Traversal)
   */
  _resolvePath(key) {
    if (!key || typeof key !== 'string') {
      throw new Error('Invalid storage key');
    }

    // Strip out directory paths to enforce flat storage within root
    const safeKey = path.basename(key);
    const targetPath = path.resolve(this.storageRoot, safeKey);

    // Verify resolved path is strictly within storageRoot
    if (!targetPath.startsWith(this.storageRoot)) {
      throw new Error('Access denied: Path traversal detected');
    }

    return targetPath;
  }

  async save(buffer, key) {
    this._ensureDirectory();
    const filePath = this._resolvePath(key);
    await fs.promises.writeFile(filePath, buffer);
    return {
      key,
      path: filePath,
      size: buffer.length,
    };
  }

  async exists(key) {
    try {
      const filePath = this._resolvePath(key);
      await fs.promises.access(filePath, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  getStream(key) {
    const filePath = this._resolvePath(key);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return fs.createReadStream(filePath);
  }

  async getBuffer(key) {
    const filePath = this._resolvePath(key);
    return await fs.promises.readFile(filePath);
  }

  async delete(key) {
    try {
      const filePath = this._resolvePath(key);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (err) {
      console.warn(`[Storage] Failed to delete file with key '${key}':`, err.message);
      return false;
    }
  }
}
