import { Router } from 'express';
import { getAiHealth, analyzeEvidence } from '../controllers/ai.controller.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// GET /api/ai/health -> Proxies to Python AI Service /health
router.get('/health', getAiHealth);

// POST /api/ai/analyze -> Proxies to Python AI Service /analyze (protected by AI rate limiter)
router.post('/analyze', aiRateLimiter.middleware(), analyzeEvidence);

export default router;
