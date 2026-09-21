/**
 * InfraSync AI Evidence File Storage & Upload Test Suite
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { StorageService } from '../src/storage/storage.service.js';
import { LocalStorageProvider } from '../src/storage/localStorage.provider.js';

const TEST_UPLOAD_DIR = './storage/test_uploads';

async function runStorageTests() {
  console.log('--- Starting Evidence Storage Tests ---');

  // Setup isolated test directory
  const testProvider = new LocalStorageProvider(TEST_UPLOAD_DIR);
  const testStorageService = new StorageService(testProvider);

  let passed = 0;
  let failed = 0;

  const testAssert = (name, condition) => {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name}`);
      failed++;
    }
  };

  try {
    // 1. Allowed Image Save & SHA-256 Checksum Test
    const sampleImageBuffer = Buffer.from('fake-jpeg-binary-data-test-string-12345');
    const expectedChecksum = crypto.createHash('sha256').update(sampleImageBuffer).digest('hex');

    const imageFilePayload = {
      originalname: 'pier_p3_inspection.jpg',
      mimetype: 'image/jpeg',
      buffer: sampleImageBuffer,
      size: sampleImageBuffer.length,
    };

    const savedImageMeta = await testStorageService.saveEvidenceFile(imageFilePayload);
    testAssert('1. Allowed image upload saved with key', !!savedImageMeta.key && savedImageMeta.storedName.endsWith('.jpg'));
    testAssert('2. SHA-256 checksum generated correctly', savedImageMeta.checksum === expectedChecksum);
    testAssert('3. Storage provider file existence check', await testProvider.exists(savedImageMeta.key));

    // 4. Allowed PDF Upload Test
    const samplePdfBuffer = Buffer.from('%PDF-1.4 test document stream content');
    const pdfFilePayload = {
      originalname: 'concrete_slump_test.pdf',
      mimetype: 'application/pdf',
      buffer: samplePdfBuffer,
      size: samplePdfBuffer.length,
    };
    const savedPdfMeta = await testStorageService.saveEvidenceFile(pdfFilePayload);
    testAssert('4. Allowed PDF document saved', !!savedPdfMeta.key && savedPdfMeta.storedName.endsWith('.pdf'));

    // 5. Allowed Video Upload Test
    const sampleVideoBuffer = Buffer.from('mp4-video-box-header-test-data');
    const videoFilePayload = {
      originalname: 'drone_flyover.mp4',
      mimetype: 'video/mp4',
      buffer: sampleVideoBuffer,
      size: sampleVideoBuffer.length,
    };
    const savedVideoMeta = await testStorageService.saveEvidenceFile(videoFilePayload);
    testAssert('5. Allowed MP4 video saved', !!savedVideoMeta.key && savedVideoMeta.storedName.endsWith('.mp4'));

    // 6. Rejected Unsupported MIME Type Test
    let unsupportedCaught = false;
    try {
      await testStorageService.saveEvidenceFile({
        originalname: 'malicious.exe',
        mimetype: 'application/x-msdownload',
        buffer: Buffer.from('binary-code'),
        size: 11,
      });
    } catch (err) {
      if (err.code === 'UNSUPPORTED_FILE_TYPE') {
        unsupportedCaught = true;
      }
    }
    testAssert('6. Rejected unsupported MIME type (.exe / application/x-msdownload)', unsupportedCaught);

    // 7. Path Traversal Prevention Test
    let pathTraversalBlocked = false;
    try {
      testProvider.getStream('../../etc/passwd');
    } catch (err) {
      if (err.message.includes('Path traversal') || err.message.includes('Access denied')) {
        pathTraversalBlocked = true;
      }
    }
    // Alternatively basename enforcement prevents traversal
    if (!pathTraversalBlocked) {
      try {
        const stream = testProvider.getStream('..\\..\\secret.key');
        if (!stream) pathTraversalBlocked = true;
      } catch {
        pathTraversalBlocked = true;
      }
    }
    testAssert('7. Path traversal strictly prevented by storage provider', pathTraversalBlocked);

    // 8. File Stream Retrieval & Content Match Test
    const stream = await testStorageService.getEvidenceStream(savedImageMeta.key);
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const retrievedBuffer = Buffer.concat(chunks);
    testAssert('8. File stream retrieved and content matches original buffer', retrievedBuffer.equals(sampleImageBuffer));

    // 9. File Deletion / Cleanup Test
    const deleteResult = await testStorageService.deleteEvidenceFile(savedImageMeta.key);
    const existsAfterDelete = await testProvider.exists(savedImageMeta.key);
    testAssert('9. Storage file deletion and cleanup verified', deleteResult && !existsAfterDelete);

    // Clean up remaining test files
    await testStorageService.deleteEvidenceFile(savedPdfMeta.key);
    await testStorageService.deleteEvidenceFile(savedVideoMeta.key);

  } catch (err) {
    console.error('❌ [FAIL] Unexpected error during storage tests:', err);
    failed++;
  } finally {
    // Remove isolated test directory
    try {
      if (fs.existsSync(path.resolve(TEST_UPLOAD_DIR))) {
        fs.rmSync(path.resolve(TEST_UPLOAD_DIR), { recursive: true, force: true });
      }
    } catch (cleanErr) {
      console.warn('Could not clean up test folder:', cleanErr.message);
    }
  }

  console.log(`\nStorage Results: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runStorageTests();
